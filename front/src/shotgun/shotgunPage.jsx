import React from "react";
import { map } from "lodash/fp";

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

        this.createShotgun = this.createShotgun.bind(this);
    }

    async createShotgun(event, room, floor) {
        //	const wait = ms => new Promise((r, j) => setTimeout(r, ms));

        ////////////////////////////////////////////////////////////////////////
        ////// set state as loading while waiting for query results ////////////
        ////////////////////////////////////////////////////////////////////////

        const SERVER_ENDPOINT = "http://localhost:3000";
        const apiCallUsersRoute = SERVER_ENDPOINT + "/users";
        const serverRequestUsers = getCallApi(apiCallUsersRoute, false);

        room.id = "5aef0f727ef13f578c01164c";

        const apiPostCreateShotgunRoute = SERVER_ENDPOINT + "/shotgun/rooms/" + room.id;
        const createShotgun = postCallApi(apiPostCreateShotgunRoute, { roomId: room.id }, true);

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

    async addPersonsInShotgun(roommatesIds = [], roomId, shotgunId) {
        if (roommatesIds.length < 1) {
            throw new Error("no roommates to add");
        } else {
            const SERVER_ENDPOINT = "http://localhost:3000";
            const apiPutPersoninShotgunRoute = SERVER_ENDPOINT + "/shotgun/rooms/" + roomId;
            const createShotgun = putCallApi(apiPostCreateShotgunRoute, { roomId: roomId }, true);
        }
    }

    render() {
        switch (this.state.shotgunPhase) {
            case "preShotgun":
                return <DisplayAllFloors />;

            case "waitingForConfirm":
                return <Floor floorData={this.state.floor} />;

            case "attributingBeds":
                return <Floor floorData={this.state.floor} />;

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
