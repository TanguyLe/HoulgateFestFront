import React from "react";
import { map, filter, find, get, isNil, includes } from "lodash/fp";

import Floor from "./Floor";
import DisplayAllFloors from "./Floor/DisplayAllFloors";
import { villaLesGenets } from "./villaLesGenetsDef";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "./constants";

import {
  getCallApi,
  postCallApi,
  putCallApi
} from "../utils/api/fetchMiddleware";

const SERVER_ENDPOINT = "./api";
const INTERVAL_DURATION = 15000;

class ShotgunContainer extends React.Component {
  constructor(props) {
    super(props);

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
      userState: "",
      availablePersonsIds: []
    };

    this.addPersonsInShotgun = this.addPersonsInShotgun.bind(this);
    this.createShotgun = this.createShotgun.bind(this);
    this.getRoomIdFromRoomName = this.getRoomIdFromRoomName.bind(this);
    this.getUserMailFromUserId = this.getUserMailFromUserId.bind(this);
  }

  async componentDidMount() {
    const apiCallRoutesUser = SERVER_ENDPOINT + "/rooms";
    const queriedRooms = (await (await getCallApi(
      apiCallRoutesUser,
      false
    )).json()).data;
    this.setState({ queriedRooms });

    this.updateFloors();
    this.updateUserState();
    this.updateAvailableUsers();

    this.refrechInterval = setInterval(() => {
      this.updateFloors();
      this.updateUserState();
      this.updateAvailableUsers();
    }, INTERVAL_DURATION);
  }
  getRoomIdFromRoomName(roomName) {
    return get(
      "_id",
      find(room => room.text === roomName, this.state.queriedRooms)
    );
  }

  getUserMailFromUserId(userId) {
		console.log(this.state.availablePersonsIds)
    return get(
      "email",
      find(user => user._id === userId, this.state.availablePersonsIds)
    );
  }

  updateState(room, floor) {
    const villaLesGenets = {
      floors: map(oldFloor => {
        if (oldFloor.name === floor.name) {
          return floor;
        } else {
          return oldFloor;
        }
      }, this.state.villaLesGenets.floors)
    };

    this.setState({
      villaLesGenets: villaLesGenets,
      room: room,
      floor: floor
    });
  }

  async updateFloors() {
    const apiCallShotgunRoomsRoute = SERVER_ENDPOINT + "/shotgun/rooms/";

    const roomsServerState = await getCallApi(apiCallShotgunRoomsRoute, false);
    const shotgunsOnDb = (await roomsServerState.json()).data;

    const alreadyShotgunedRoomsIds = map(
      shotgun => shotgun.room._id,
      shotgunsOnDb
    );

    const updateFloorRooms = floor => ({
      ...floor,
      rooms: map(room => {
        let state;
        if (
          includes(
            this.getRoomIdFromRoomName(room.name),
            alreadyShotgunedRoomsIds
          )
        ) {
          if (!isNil(this.state.shotgunId)) {
              if (
                this.getRoomIdFromRoomName(room.name) ===
                find(shotgun => shotgun._id === this.state.shotgunId).room._id
              ) {
                state = "shotgunSuccessful";
              }
            } else {
            state = "shotguned";
          }
        } else {
          state = "readyForShotgun";
        }
        return {
          ...room,
          state,
          id: this.getRoomIdFromRoomName(room.name)
        };
      }, floor.rooms)
    });

    const newFloors = map(updateFloorRooms, this.state.villaLesGenets.floors);

    this.setState({
      villaLesGenets: { ...villaLesGenets, floors: newFloors }
    });
  }

  async updateUserState() {
    const apiCallUsersRoute = SERVER_ENDPOINT + "/users";

    const usersStates = await getCallApi(apiCallUsersRoute, false);
    const usersStatesOnDb = (await usersStates.json()).data;

    const currentUserUsername = window.localStorage.getItem("username");

    const user = find(
      user => user.username === currentUserUsername,
      usersStatesOnDb
    );

    this.setState({
      userState: {
        hasShotgun: user.hasShotgun,
        isShotgun: user.isShotgun,
        room: user.room
      }
    });
  }

  async updateAvailableUsers() {
    const apiCallUsersRoute = SERVER_ENDPOINT + "/users";
    const serverRequestUsers = getCallApi(apiCallUsersRoute, false);

    const UsersServerAnswer = await serverRequestUsers;
    const listOfUsers = (await UsersServerAnswer.json()).data;

    const currentUserUsername = window.localStorage.getItem("username");

    const availablePersonsIds = filter(
      person =>
        (person.hasShotgun === false && person.isShotgun === false) ||
        currentUserUsername === person.username,
      listOfUsers
    );

    this.setState({
      availablePersonsIds: availablePersonsIds
    });

    return availablePersonsIds;
  }

  async createShotgun(event, room, floor) {
    ////////////////////////////////////////////////////////////////////////
    ////// set state as loading while waiting for query results ////////////
    ////////////////////////////////////////////////////////////////////////

    const availablePersonsIdsQuery = this.updateAvailableUsers();

    const roomId = this.getRoomIdFromRoomName(room.name);

    const apiPostCreateShotgunRoute =
      SERVER_ENDPOINT + "/shotgun/rooms/" + roomId;
    const createShotgunQuery = postCallApi(
      apiPostCreateShotgunRoute,
      { roomId: roomId },
      true
    );

    this.updateFloors();
    this.updateUserState();

    room["state"] = "loading";
    floor["rooms"] = [...floor.rooms, room];

    this.updateState(room, floor);

    ////////////////////////////////////////////////////////////////////////
    ////// waiting for server answer ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    const shotgunServerUpdate = await createShotgunQuery;

    if (shotgunServerUpdate.status === 200) {
      ////////////////////////////////////////////////////////////////////
      ////// preShotgunConfirmed /////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////

      const shotgunResult = (await shotgunServerUpdate.json()).data;

      const availablePersonsIds = await availablePersonsIdsQuery;

      room["state"] = "attributingBeds";
      room["availablePersonsIds"] = availablePersonsIds;
      floor["rooms"] = [...floor.rooms, room];

      this.updateState(room, floor);

      this.setState({
        availablePersonsIds: availablePersonsIds,
        shotgunId: shotgunResult._id
      });
    } else {
      ////////////////////////////////////////////////////////////////////
      ////// preShotgun denined //////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////

      alert("this room is not available anymore or you already shotgunned a room");
      room["state"] = "disabled";
      floor["rooms"] = [...floor.rooms, room];

      this.updateState(room, floor);

      this.updateFloors();
      this.updateUserState();
    }
  }

  async addPersonsInShotgun(roomName, roommatesIds = []) {
    const shotgunId = this.state.shotgunId;

    console.log(roommatesIds);

    const roomId = this.getRoomIdFromRoomName(roomName);
    if (roommatesIds.length < 1) {
      throw new Error("no roommates to add");
    } else {
      const roommatesEmails = map(
        id => this.getUserMailFromUserId(id),
        roommatesIds
      );

      console.log(roommatesEmails);
      const apiPutPersoninShotgunRoute =
        SERVER_ENDPOINT + "/shotgun/rooms/" + roomId;
      const addUserToShotgun = putCallApi(
        apiPutPersoninShotgunRoute,
        { roomId: roomId, roommates: roommatesEmails, shotgunId },
        true
      );

      const floor = find(
        floor => includes(roomName, map(room => room.name, floor.rooms)),
        this.state.villaLesGenets.floors
      );

      const room = find(
        roomOfFloor => roomOfFloor.name === roomName,
        floor.rooms
      );

      const addUserToShotgunResult = await addUserToShotgun;

      if (addUserToShotgunResult.status === 200) {
        const addUserToShotgunBody = (await addUserToShotgunResult.json()).data;

        room["state"] = "shotgunSuccessful";
        floor["rooms"] = [...floor.rooms, room];

        this.updateState(room, floor);

        this.setState({
          // Work in progress there, the state doesn't go down
        });
        console.log("shotgun successful");
      } else {
        room["state"] = "shotgunFailed";
        floor["rooms"] = [...floor.rooms, room];

        this.updateState(room, floor);

        console.log("shotgun failed");
      }
    }
  }

  render() {
    return (
      <DisplayAllFloors
        floors={this.state.villaLesGenets.floors}
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
