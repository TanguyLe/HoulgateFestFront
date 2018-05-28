import React from "react";
import { map, filter, find, get, includes } from "lodash/fp";

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
			userState: ""
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

		this.refrechInterval = setInterval(() => {
			this.updateFloors();
			this.updateUserState();
		}, INTERVAL_DURATION);
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

	async updateAvailableUsers() {
		const apiCallUsersRoute = SERVER_ENDPOINT + "/users";
		const serverRequestUsers = getCallApi(apiCallUsersRoute, false);

		const UsersServerAnswer = await serverRequestUsers;
		const listOfUsers = (await UsersServerAnswer.json()).data;

		const availablePersonIds = filter(
			person => person.hasShotgun === false && person.isShotgun === false,
			listOfUsers
		);

		this.setState({
			availablePersons: availablePersonIds
		});

		return availablePersonIds;
	}

	async createShotgun(event, room, floor) {
		////////////////////////////////////////////////////////////////////////
		////// set state as loading while waiting for query results ////////////
		////////////////////////////////////////////////////////////////////////

		const availablePersonIdsQuery = this.updateAvailableUsers();

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

			const availablePersonIds = await availablePersonIdsQuery;

			room["state"] = "attributingBeds";
			room["availablePersonIds"] = availablePersonIds;
			floor["rooms"] = [...floor.rooms, room];

			this.updateState(room, floor);

			this.setState({
				availablePersons: availablePersonIds,
				shotgunId: shotgunResult._id
			});
		} else {
			////////////////////////////////////////////////////////////////////
			////// preShotgun denined //////////////////////////////////////////
			////////////////////////////////////////////////////////////////////

			alert(
				"this room is not available anymore or you already shotgun a room"
			);
			room["state"] = "disabled";
			floor["rooms"] = [...floor.rooms, room];

			this.updateState(room, floor);

			this.updateFloors();
			this.updateUserState();
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

	componentWillUnmount() {
		clearInterval(this.refrechInterval);
	}
}

export default ShotgunContainer;
