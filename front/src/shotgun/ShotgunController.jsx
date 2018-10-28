import React from "react";
import {
    Icon,
    Message
} from "semantic-ui-react";
import {map, filter, find, get, isNil, includes} from "lodash/fp";

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
                            room["state"] = "readyForShotgun";
                            return room;
                        }, floor.rooms)
                    };
                }, villaLesGenets.floors)
            },
            status: "loading",
            userState: {},
            availablePersonsIds: []
        };

        this.addPersonsInShotgun = this.addPersonsInShotgun.bind(this);
        this.createShotgun = this.createShotgun.bind(this);
    }

    componentDidUpdate(){
        // console.log("updated")
        // console.log(Object.assign({}, this.state))
    }

    async componentDidMount() {
        const roomsApiCall = (await getCallApi(ROOMS_ENDPOINT, false));
        const rooms = (await roomsApiCall.json()).data;

        let roomsIndexed = rooms.reduce((acc, room) => ({...acc, [room._id]: room}), {});

        const RoomFct = (room) => {
            const roomName = room.name;

            const roomId = get("_id", find(room => room.text === roomName, rooms));
            roomsIndexed[roomId] = Object.assign(roomsIndexed[roomId], room);

            return roomId;
        };

        const floorFct = (floor) => {
            return Object.assign(floor, {rooms: map(RoomFct, floor.rooms)})
        };

        this.state.villaLesGenets.floors = map(floorFct, this.state.villaLesGenets.floors);
        this.setState({roomsIndexed: roomsIndexed});

        this.updateFloors();
        this.updateUsers();

        this.refrechInterval = setInterval(() => {
            this.updateFloors();
            this.updateUsers();
        }, INTERVAL_DURATION);
    }

    updateRoom(roomId, newRoom) {
        const currentRoom = this.state.roomsIndexed[roomId];
        this.setState(Object.assign({roomsIndexed: Object.assign(this.state.roomsIndexed,
                                                          {[roomId]: Object.assign({}, currentRoom, newRoom)})}));
    }

    async updateFloors() {
        const shotgunsApiCall = await getCallApi(SHOTGUN_ROOMS_ENDPOINT, false);
        const shotguns = (await shotgunsApiCall.json()).data;

        const alreadyShotgunnedRoomsIds = map(shotgun => shotgun.room._id, shotguns);

        const updateRooms = room => {
            if (room._id in alreadyShotgunnedRoomsIds)
                return Object.assign({}, room, {status: "shotgunSuccessful"});

            return Object.assign({}, room, {status: "readyForShotgun"})
        };

        this.setState({roomsIndexed: objectMap(this.state.roomsIndexed, updateRooms), status: "loaded"});
    }

    async updateUsers() {
        const usersApiCall = await getCallApi(USERS_ENDPOINT, false);
        const users = (await usersApiCall.json()).data;

        const currentUserUsername = window.localStorage.getItem("username");

        const user = find(user => user.username === currentUserUsername, users);

        const availablePersonsIds = filter(person =>
                (person.hasShotgun === false && person.isShotgun === false),
            users
        );

        this.setState(Object.assign({
            userState: {
                hasShotgun: user.hasShotgun,
                isShotgun: user.isShotgun,
                room: user.room
            },
            availablePersonsIds: availablePersonsIds
        }));

        return availablePersonsIds
    }

    async createShotgun(event, roomId) {
        ////////////////////////////////////////////////////////////////////////
        ////// set state as loading while waiting for query results ////////////
        ////////////////////////////////////////////////////////////////////////

        const availablePersonsIdsQuery = this.updateUsers();

        const createShotgunQuery = postCallApi(getShotgunRoomUrl(roomId), {roomId: roomId}, true);

        await this.updateFloors();

        this.updateRoom(roomId, {state: "loading"});

        ////////////////////////////////////////////////////////////////////////
        ////// waiting for server answer ///////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        const shotgunServerUpdate = await createShotgunQuery;

        if (shotgunServerUpdate.status === 200) {
            ////////////////////////////////////////////////////////////////////
            ////// preShotgunConfirmed /////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////

            const shotgunResult = (await shotgunServerUpdate.json());

            const availablePersonsIds = await availablePersonsIdsQuery;

            this.updateRoom(roomId, {state: "attributingBeds", "availablePersonsIds": availablePersonsIds});

            this.setState({
                availablePersonsIds: availablePersonsIds,
                shotgunId: shotgunResult._id
            });
        } else {
            ////////////////////////////////////////////////////////////////////
            ////// preShotgun denied //////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////

            alert("this room is not available anymore or you already shotgunned a room");
            this.updateRoom(roomId, {state: "disabled"});

            await this.updateFloors();
            await this.updateUsers();
        }
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

                this.updateRoom(roomId, {state: "shotgunSuccessful"});

                this.updateUsers();
                this.setState({
                    // Work in progress there, the state doesn't go down
                });
            } else
                this.updateRoom(roomId, {state: "shotgunFailed"});
        }
    }

    getFloorsToRender(){
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
