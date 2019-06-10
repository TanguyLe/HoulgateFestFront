import React from "react";
import {Icon, Message} from "semantic-ui-react";

import DisplayAllFloors from "./Floor/DisplayAllFloors";
import {objectMap} from "../utils/miscFcts"
import {villaLesGenets} from "./villaLesGenetsDef";
import {USERS_ENDPOINT} from "../constants"
import {
    ROOMS_ENDPOINT,
    SHOTGUN_ROOMS_ENDPOINT,
    getShotgunRoomUrl,
    ROOM_STATUS_LOADING,
    ROOM_STATUS_SHOTGUNNED,
    ROOM_STATUS_PRESHOTGUNNED,
    ROOM_STATUS_READY
} from "./constants";

import {getCallApi, postCallApi, putCallApi} from "../utils/api/fetchMiddleware";

const INTERVAL_DURATION = 15000;

class ShotgunContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            villaLesGenets: {
                floors: villaLesGenets.floors.map(floor => ({
                    ...floor, rooms: floor.rooms.map(room => ({...room, status: ROOM_STATUS_READY}))
                }))
            },
            loading: true,
            shotgunId: null,
            userInfo: {},
            roomsIndexed: {}
        };

        this.addPersonsInShotgun = this.addPersonsInShotgun.bind(this);
        this.createShotgun = this.createShotgun.bind(this);
        this.intervalFunction = this.intervalFunction.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    getRoomUpdater(roomId, newRoom) {
        /**
         * Returns an updater for the roomsIndexed particularly to change one Room.
         * It is an object to be used with the updateState method.
         */
        const currentRoom = this.state.roomsIndexed[roomId];
        return Object.assign({
            roomsIndexed: Object.assign(this.state.roomsIndexed,
                {[roomId]: Object.assign({}, currentRoom, newRoom)})
        });
    }

    async getUsersUpdater() {
        /**
         * Returns an updater for the userInfo and eventually shotgunId.
         * It is an object up-to-date with the server to be used with the updateState method.
         */
        const usersApiCall = await getCallApi(USERS_ENDPOINT, false);
        const users = (await usersApiCall.json()).data;

        const currentUserUsername = window.localStorage.getItem("username");

        const currentUser = users.find(user => user.username === currentUserUsername);

        let userInfo = {};
        users.forEach((user) => userInfo[user._id] = user);

        let res = {userInfo: userInfo};
        if (!currentUser.hasShotgun && !currentUser.hasPreShotgun)
            res.shotgunId = null;

        return res;
    }

    async getFloorsUpdater() {
        /**
         * Returns an updater for the roomsIndexed and status. The page is considered loaded when any of those is applied
         * to the state.
         * It is an object up-to-date with the server to be used with the updateState method.
         */
        const shotgunsApiCall = await getCallApi(SHOTGUN_ROOMS_ENDPOINT, false);
        const shotgunsList = (await shotgunsApiCall.json()).data;

        // Right now it doesn't seem straightforward, but getFloorsUpdater should be able to use getRoomUpdater a
        // way or another.
        const updateRoom = room => {
            let related_shotgun = shotgunsList.find(shotgun => shotgun.room._id === room._id);
            if (!related_shotgun)
                return Object.assign({}, room, {status: ROOM_STATUS_READY});
            else
                return Object.assign({}, room, related_shotgun, related_shotgun.room);
        };

        return {roomsIndexed: objectMap(this.state.roomsIndexed, updateRoom), loading: false};
    }

    updateState(updaters, callback) {
        let nextState = {};

        updaters.forEach((val) => {
            nextState = Object.assign(nextState, val)
        });

        this.setState(nextState, callback);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ||
            (JSON.stringify(nextState) !== JSON.stringify(this.state))
    }

    async intervalFunction() {
        const floorsUpdater = await this.getFloorsUpdater();
        const usersUpdater = await this.getUsersUpdater();

        this.updateState([floorsUpdater, usersUpdater]);
    }

    async componentDidMount() {
        /**
         * Fetches the rooms' definition and the floors' definition, updates once with the eventual shotguns and
         * the user, and then start the time-outed refreshes.
         */
        const roomsApiCall = (await getCallApi(ROOMS_ENDPOINT, false));
        const rooms = (await roomsApiCall.json()).data;

        const RoomFct = (room) => {
            const roomName = room.name;

            const roomId = rooms.find(room => room.text === roomName)._id;
            roomsIndexed[roomId] = Object.assign(roomsIndexed[roomId], room);

            return roomId;
        };

        const floorFct = (floor) => {
            return Object.assign(floor, {rooms: floor.rooms.map(RoomFct)})
        };

        let roomsIndexed = rooms.reduce((acc, room) => ({...acc, [room._id]: room}), {});

        this.updateState([{
            villaLesGenets: Object.assign(this.state.villaLesGenets,
                {floors: this.state.villaLesGenets.floors.map(floorFct)}),
            roomsIndexed: roomsIndexed
        }], async () => {

            const floorsUpdater = await this.getFloorsUpdater();
            const usersUpdater = await this.getUsersUpdater();

            this.updateState([floorsUpdater, usersUpdater], () => {
                this.refrechInterval = setInterval(this.intervalFunction, INTERVAL_DURATION);
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.refrechInterval);
    }

    async createShotgun(event, roomId) {
        ////////////////////////////////////////////////////////////////////////
        ////// set state as loading while waiting for query results ////////////
        ////////////////////////////////////////////////////////////////////////
        let roomUpdater = this.getRoomUpdater(roomId, {status: ROOM_STATUS_LOADING});

        this.updateState([roomUpdater], async () => {
            // Trying to shotgun it
            const shotgunServerUpdate = await postCallApi(getShotgunRoomUrl(roomId), {roomId: roomId}, true);

            if (shotgunServerUpdate.status === 200) {
                ////////////////////////////////////////////////////////////////////
                ////// preShotgunConfirmed /////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////

                const shotgunResult = (await shotgunServerUpdate.json());
                const usersUpdater = await this.getUsersUpdater();

                roomUpdater = this.getRoomUpdater(roomId, {status: ROOM_STATUS_PRESHOTGUNNED});

                // And update the shotgunId, the users and the room
                this.updateState([{shotgunId: shotgunResult.data._id}, usersUpdater, roomUpdater]);
            } else {
                ////////////////////////////////////////////////////////////////////
                ////// preShotgun denied //////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////

                // The shotgun was denied, several possible reasons, may need to elaborate in the future.
                alert("Cette pièce n'est plus disponible, ou tu as déjà shotgun.");
            }
            await this.intervalFunction();
        });
    }

    async addPersonsInShotgun(roomId, roommatesIds = []) {
        const shotgunId = this.state.shotgunId;

        let roomUpdater = this.getRoomUpdater(roomId, {status: ROOM_STATUS_LOADING});

        this.updateState([roomUpdater], async () => {
            // Trying to complete the shotgun
            const addUserToShotgun = await putCallApi(
                getShotgunRoomUrl(roomId), {roomId: roomId, roommates: roommatesIds, shotgunId}, true
            );

            if (addUserToShotgun.status === 200) {
                const roomUpdater = this.getRoomUpdater(roomId, {status: ROOM_STATUS_SHOTGUNNED});
                const usersUpdater = await this.getUsersUpdater();

                // Updating the users and the room.
                this.updateState([usersUpdater, roomUpdater]);
            } else {
                // The shotgun was denied, several possible reasons, may need to elaborate in the future.
                alert("Trop tard! Cette pièce est soit déjà shotgun, soit toi ou un de " +
                    "tes camarades est déjà inscrit dans une pièce.");
            }
            await this.intervalFunction();
        });
    }

    getFloorsToRender() {
        const replaceRoom = (roomId) => {
            return this.state.roomsIndexed[roomId]
        };

        const replaceFloor = (floor) => {
            return Object.assign({}, floor, {rooms: floor.rooms.map(replaceRoom)})
        };

        return this.state.villaLesGenets.floors.map(replaceFloor);
    }

    render() {
        if (this.state.loading)
            return <Message info icon>
                <Icon name="circle notched" loading/>
                <Message.Content>Chargement des pièces...</Message.Content>
            </Message>;

        return <DisplayAllFloors
            floors={this.getFloorsToRender()}
            userInfo={this.state.userInfo}
            createShotgunFunction={this.createShotgun}
            addPersonsInShotgunFunction={this.addPersonsInShotgun}
        />;


    }
}

export default ShotgunContainer;
