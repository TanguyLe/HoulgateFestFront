import React from "react";
import { map, find, get, includes } from "lodash/fp";

import Floor from "./Floor";
import DisplayAllFloors from "./Floor/DisplayAllFloors";
import { villaLesGenets } from "./villaLesGenetsDef";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "./constants";

import {
	getCallApi,
	postCallApi,
	putCallApi
} from "../utils/api/fetchMiddleware";

const SERVER_ENDPOINT = "http://localhost:3000";

class ShotgunContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			shotgunPhase: "readyForShotgun",
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
			userState: "readyForShotgun"
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
	}
	getRoomIdFromRoomName(roomName) {
		return get(
			"_id",
			find(room => room.text === roomName, this.state.queriedRooms)
		);
	}

	getUserMailFromUserId(userId) {
		return get(
			"email",
			find(user => user._id === userId, this.state.availablePersons)
		);
	}

	async updateFloors() {
		const apiCallShotgunRoomsRoute = SERVER_ENDPOINT + "/shotgun/rooms/";

		const roomsServerState = await getCallApi(
			apiCallShotgunRoomsRoute,
			false
		);
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
					state = "shotguned";
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

		const newFloors = map(
			updateFloorRooms,
			this.state.villaLesGenets.floors
		);

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

	async createShotgun(event, room, floor) {
		////////////////////////////////////////////////////////////////////////
		////// set state as loading while waiting for query results ////////////
		////////////////////////////////////////////////////////////////////////

		const apiCallUsersRoute = SERVER_ENDPOINT + "/users";
		const serverRequestUsers = getCallApi(apiCallUsersRoute, false);

		const roomId = this.getRoomIdFromRoomName(room.name);

		const apiPostCreateShotgunRoute =
			SERVER_ENDPOINT + "/shotgun/rooms/" + roomId;
		const createShotgunQuery = postCallApi(
			apiPostCreateShotgunRoute,
			{ roomId: roomId },
			true
		);

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

		const shotgunServerUpdate = await createShotgunQuery;

		if (shotgunServerUpdate.status === 200) {
			////////////////////////////////////////////////////////////////////
			////// preShotgunConfirmed /////////////////////////////////////////
			////////////////////////////////////////////////////////////////////

			const shotgunResult = (await shotgunServerUpdate.json()).data;
			const UsersServerAnswer = await serverRequestUsers;
			const availablePersonIds = (await UsersServerAnswer.json()).data;

			room["state"] = "attributingBeds";
			room["availablePersonIds"] = availablePersonIds;
			floor["rooms"] = [...floor.rooms, ...room];

			this.setState({
				availablePersons: availablePersonIds,
				shotgunId: shotgunResult._id,
				shotgunPhase: "attributingBeds",
				room: room,
				floor: floor
			});
		} else {
			////////////////////////////////////////////////////////////////////
			////// preShotgun denined //////////////////////////////////////////
			////////////////////////////////////////////////////////////////////

			alert(
				"this room is not available anymore or you already shotgun a room"
			);
			room["state"] = "disabled";
			floor["rooms"] = [
				...map(room => {
					room["state"] = "readyForShotgun";
					return room;
				}, floor.rooms),
				...room
			];
			this.setState({
				shotgunPhase: "preShotgun",
				room: room,
				floor: floor
			});
		}
	}

	async addPersonsInShotgun(roomName, roommatesIds = []) {
		const shotgunId = this.state.shotgunId;

		const roomId = this.getRoomIdFromRoomName(roomName);
		if (roommatesIds.length < 1) {
			throw new Error("no roommates to add");
		} else {
			const roommatesEmails = map(
				id => this.getUserMailFromUserId(id),
				roommatesIds
			);

			const apiPutPersoninShotgunRoute =
				SERVER_ENDPOINT + "/shotgun/rooms/" + roomId;
			const addUserToShotgun = putCallApi(
				apiPutPersoninShotgunRoute,
				{ roomId: roomId, roommates: roommatesEmails, shotgunId },
				true
			);
			const addUserToShotgunResult = await addUserToShotgun;
			if (addUserToShotgunResult.status === 200) {
				this.setState({
					// Work in progress there, the state doesn't go down
					shotgunPhase: "shotgunSuccessful"
				});
				console.log("shotgun successful");
			} else {
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
				addPersonsInShotgunFunction={this.addPersonsInShotgun}
			/>
		);
	}
}

export default ShotgunContainer;
