import React from "react";
import { map, find, get } from "lodash/fp";

import Floor from "./Floor";
import DisplayAllFloors from "./Floor/DisplayAllFloors";
import { villaLesGenets } from "./villaLesGenetsDef";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "./constants";

import { getCallApi, postCallApi, putCallApi } from "../utils/api/fetchMiddleware";

class ShotgunContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            villaLesGenets: {
                floors: map(floor => {
                    return map(room => {
                        room["state"] = "readyForShotgun";
                        return room;
                    }, floor.rooms);
                }, villaLesGenets.floors)
            }
        };

        this.addPersonsInShotgun = this.addPersonsInShotgun.bind(this);
        this.createShotgun = this.createShotgun.bind(this);
        this.getRoomIdFromRoomName = this.getRoomIdFromRoomName.bind(this);
    }

    async componentDidMount() {
        const SERVER_ENDPOINT = "http://localhost:3000";
        const apiCallRoutesUser = SERVER_ENDPOINT + "/rooms";
        const queriedRooms = (await (await getCallApi(apiCallRoutesUser, false)).json()).data;
        console.log(queriedRooms);

        this.setState({ queriedRooms });
    }
    getRoomIdFromRoomName(roomName) {
        return get("_id", find(room => room.text === roomName, this.state.queriedRooms));
    }

    async createShotgun(event, room, floor) {
        //	const wait = ms => new Promise((r, j) => setTimeout(r, ms));

        ////////////////////////////////////////////////////////////////////////
        ////// set state as loading while waiting for query results ////////////
        ////////////////////////////////////////////////////////////////////////

        const SERVER_ENDPOINT = "http://localhost:3000";
        const apiCallUsersRoute = SERVER_ENDPOINT + "/users";
        const serverRequestUsers = getCallApi(apiCallUsersRoute, false);

        const roomId = this.getRoomIdFromRoomName(room.name);

        const apiPostCreateShotgunRoute = SERVER_ENDPOINT + "/shotgun/rooms/" + roomId;
        const createShotgun = postCallApi(apiPostCreateShotgunRoute, { roomId: roomId }, true);

        room["state"] = "loading";
        floor["rooms"] = [
            ...map(room => {
                room["state"] = "disabled";
                return room;
            }, floor.rooms),
            ...room
        ];
        this.setState({
            shotgunPhase: "waitingForConfirm",
            room: room,
            floor: floor
        });

        ////////////////////////////////////////////////////////////////////////
        ////// waiting for server answer ///////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        // await preShotgunConfirmed

        const shotgunServerUpdate = await createShotgun;
        const shotgunResult = (await shotgunServerUpdate.json()).data;

        const preShotgunConfirmed = true; //hardcoded temporary

        if (preShotgunConfirmed === true) {
            ////////////////////////////////////////////////////////////////////
            ////// preShotgunConfirmed /////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////

            const UsersServerAnswer = await serverRequestUsers;
            const availablePersonIds = (await UsersServerAnswer.json()).data;

            room["state"] = "attributingBeds";
            room["availablePersonIds"] = availablePersonIds;
            floor["rooms"] = [...floor.rooms, ...room];

            this.setState({
                shotgunId: shotgunResult._id,
                shotgunPhase: "attributingBeds",
                room: room,
                floor: floor
            });
        } else {
            ////////////////////////////////////////////////////////////////////
            ////// preShotgun denined //////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////
        }
    }

    async addPersonsInShotgun(shotgunId, roomName, roommatesIds = []) {
        const roomId = this.getRoomIdFromRoomName(roomName);
        if (roommatesIds.length < 1) {
            throw new Error("no roommates to add");
        } else {
            // const roomatesEmails = map(  id=>get("email",find(person=>personId===id),availablePersonIds)  ,roommatesIds)
            const SERVER_ENDPOINT = "http://localhost:3000";
            const apiPutPersoninShotgunRoute = SERVER_ENDPOINT + "/shotgun/rooms/" + roomId;
            const addUserTo = putCallApi(apiPutPersoninShotgunRoute, { roomId: roomId, roomates: roommatesIds }, true);
        }
    }

    render() {
        switch (this.state.shotgunPhase) {
            case "preShotgun":
                return <DisplayAllFloors />;

            case "waitingForConfirm":
                return (
                    <Floor
                        addPersonsInShotgunFunction={(roomName, roommatesIds) =>
                            this.addPersonsInShotgun(this.state.shotgunId, roomName, roommatesIds)
                        }
                        floorData={this.state.floor}
                    />
                );

            case "attributingBeds":
                return (
                    <Floor
                        addPersonsInShotgunFunction={(roomName, roommatesIds) =>
                            this.addPersonsInShotgun(this.state.shotgunId, roomName, roommatesIds)
                        }
                        floorData={this.state.floor}
                    />
                );

            default:
                return (
                    <DisplayAllFloors
                        floors={this.state.villaLesGenets.floors}
                        createShotgunFunction={this.createShotgun}
                    />
                );
        }
    }
}

export default ShotgunContainer;
