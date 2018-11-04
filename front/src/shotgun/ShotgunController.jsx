import React from "react";
import {Icon, Message} from "semantic-ui-react";
import {map, filter, find} from "lodash/fp";

import DisplayAllFloors from "./Floor/DisplayAllFloors";
import {objectMap} from "../utils/miscFcts"
import {villaLesGenets} from "./villaLesGenetsDef";
import {USERS_ENDPOINT} from "../constants"
import {ROOMS_ENDPOINT, SHOTGUN_ROOMS_ENDPOINT, getShotgunRoomUrl} from "./constants";

import {getCallApi, postCallApi, putCallApi} from "../utils/api/fetchMiddleware";

const INTERVAL_DURATION = 15000;

class ShotgunContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            villaLesGenets: {
                floors: map(floor => {
                    return {
                        ...floor,
                        rooms: map(room => {
                            room.status = "readyForShotgun";
                            return room;
                        }, floor.rooms)
                    };
                }, villaLesGenets.floors)
            },
            status: "loading",
            shotgunId: null,
            userState: {},
            availablePersonsIds: [],
            roomsIndexed: {}
        };

        this.addPersonsInShotgun = this.addPersonsInShotgun.bind(this);
        this.createShotgun = this.createShotgun.bind(this);
        this.intervalFunction = this.intervalFunction.bind(this);
        this.updateState = this.updateState.bind(this);
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
        const roomsApiCall = (await getCallApi(ROOMS_ENDPOINT, false));
        const rooms = (await roomsApiCall.json()).data;

        let roomsIndexed = rooms.reduce((acc, room) => ({...acc, [room._id]: room}), {});

        const RoomFct = (room) => {
            const roomName = room.name;

            const roomId = find(room => room.text === roomName, rooms)._id;
            roomsIndexed[roomId] = Object.assign(roomsIndexed[roomId], room);

            return roomId;
        };

        const floorFct = (floor) => {
            return Object.assign(floor, {rooms: map(RoomFct, floor.rooms)})
        };

        this.updateState([
            {
                villaLesGenets: Object.assign(this.state.villaLesGenets,
                    {floors: map(floorFct, this.state.villaLesGenets.floors)}),
                roomsIndexed: roomsIndexed
            }], async () => {
            const floorsUpdater = await this.getFloorsUpdater();
            const usersUpdater = await this.getUsersUpdater();

            this.updateState([floorsUpdater, , usersUpdater], () => {
                this.refrechInterval = setInterval(this.intervalFunction, INTERVAL_DURATION);
            });
        });
    }

    getRoomUpdater(roomId, newRoom) {
        const currentRoom = this.state.roomsIndexed[roomId];
        return Object.assign({
            roomsIndexed: Object.assign(this.state.roomsIndexed,
                {[roomId]: Object.assign({}, currentRoom, newRoom)})
        });
    }

    async getUsersUpdater() {
        const usersApiCall = await getCallApi(USERS_ENDPOINT, false);
        const users = (await usersApiCall.json()).data;

        const currentUserUsername = window.localStorage.getItem("username");

        const user = find(user => user.username === currentUserUsername, users);

        const availablePersonsIds = filter(person =>
                ((person.hasShotgun === false && person.hasPreShotgun === false) || user._id === person._id),
            users
        );

        let res = {
            userState: {
                hasShotgun: user.hasShotgun,
                hasPreShotgun: user.hasPreShotgun,
                room: user.room
            },
            availablePersonsIds: availablePersonsIds
        };

        if (!user.hasShotgun && !user.hasPreShotgun)
            res.shotgunId = null;

        return res;
    }

    async getFloorsUpdater() {
        const shotgunsApiCall = await getCallApi(SHOTGUN_ROOMS_ENDPOINT, false);
        const shotgunsList = (await shotgunsApiCall.json()).data;

        const preShotguns = filter(shotgun => shotgun.status === "created", shotgunsList);
        const preShotgunnedRoomIds = preShotguns ? map(shotgun => shotgun.room._id, preShotguns) : [];
        const shotguns = filter(shotgun => shotgun.status === "shotgunned", shotgunsList);
        const shotgunnedRoomIds = shotguns ? map(shotgun => shotgun.room._id, shotguns) : [];


        const updateRooms = room => {
            if (preShotgunnedRoomIds.includes(room._id))
                return Object.assign({}, room, {status: "preShotgunned"});

            if (shotgunnedRoomIds.includes(room._id))
                return Object.assign({}, room, {status: "shotgunned"});

            return Object.assign({}, room, {status: "readyForShotgun"});
        };

        return {roomsIndexed: objectMap(this.state.roomsIndexed, updateRooms), status: "loaded"};
    }

    async createShotgun(event, roomId) {
        ////////////////////////////////////////////////////////////////////////
        ////// set state as loading while waiting for query results ////////////
        ////////////////////////////////////////////////////////////////////////
        let roomUpdater = this.getRoomUpdater(roomId, {status: "loading"});

        this.updateState([roomUpdater], async () => {
            // await this.getFloorsUpdater();

            ////////////////////////////////////////////////////////////////////////
            ////// waiting for server answer ///////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////

            const shotgunServerUpdate = await postCallApi(getShotgunRoomUrl(roomId), {roomId: roomId}, true);

            if (shotgunServerUpdate.status === 200) {
                ////////////////////////////////////////////////////////////////////
                ////// preShotgunConfirmed /////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////

                const shotgunResult = (await shotgunServerUpdate.json());

                const usersUpdater = await this.getUsersUpdater();

                roomUpdater = this.getRoomUpdater(roomId, {status: "attributingBeds"});

                this.updateState([{shotgunId: shotgunResult.data._id}, usersUpdater, roomUpdater]);
            } else {
                ////////////////////////////////////////////////////////////////////
                ////// preShotgun denied //////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////

                alert("this room is not available anymore or you already shotgunned a room");
                // this.getRoomUpdater(roomId, {status: "disabled"});

                const floorsUpdater = await this.getFloorsUpdater();
                const usersUpdater = await this.getUsersUpdater();
                this.updateState([usersUpdater, floorsUpdater]);
            }
        });
    }

    async addPersonsInShotgun(roomId, roommatesIds = []) {
        const shotgunId = this.state.shotgunId;

        if (roommatesIds.length < 1)
            throw new Error("no roommates to add");
        else {
            const addUserToShotgun = putCallApi(
                getShotgunRoomUrl(roomId),
                {
                    roomId: roomId,
                    roommates: roommatesIds,
                    shotgunId
                },
                true
            );

            const addUserToShotgunResult = await addUserToShotgun;

            if (addUserToShotgunResult.status === 200) {
                const addUserToShotgunBody = (await addUserToShotgunResult.json()).data;

                const roomUpdater = this.getRoomUpdater(roomId, {status: "shotgunSuccessful"});

                const usersUpdater = await this.getUsersUpdater();
                this.updateState([usersUpdater, roomUpdater]);
            } else
                4
            // this.getRoomUpdater(roomId, {status: "shotgunFailed"});
        }
    }

    getFloorsToRender() {
        const replaceRoom = (roomId) => {
            return this.state.roomsIndexed[roomId]
        };

        const replaceFloor = (floor) => {
            return Object.assign({}, floor, {rooms: map(replaceRoom, floor.rooms)})
        };

        return map(replaceFloor, this.state.villaLesGenets.floors);
    }

    render() {
        let floors = undefined;

        if (this.state.status !== "loading")
            floors = this.getFloorsToRender();

        return (
            this.state.status === "loading" ?
                <Message info icon>
                    <Icon name="circle notched" loading/>
                    <Message.Content>Chargement des pièces...</Message.Content>
                </Message>
                :
                <DisplayAllFloors
                    floors={floors}
                    userState={this.state.userState}
                    createShotgunFunction={this.createShotgun}
                    availablePersonsIds={this.state.availablePersonsIds}
                    addPersonsInShotgunFunction={this.addPersonsInShotgun}
                />
        );
    }

    componentWillUnmount() {
        clearInterval(this.refrechInterval);
    }
}

export default ShotgunContainer;
