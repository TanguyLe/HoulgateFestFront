import React from "react";
import { map } from "lodash/fp";

import Floor from "./Floor";
import DisplayAllFloors from "./Floor/DisplayAllFloors";
import { villaLesGenets } from "./villaLesGenetsDef";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "./constants";

/*
 * shotgun phases :
 * preShotgun - display all rooms
 * roomWaitingForConfirm
 * roomShotgunConfirmed
 * allShotgunConfirmed
 * roomShotgunFailed
 */

class ShotgunContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shotgunPhase: "preShotgun"
		};

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

		this.shotgunRoom = this.shotgunRoom.bind(this);
	}

	shotgunRoom(event, room, floor) {
		//	const wait = ms => new Promise((r, j) => setTimeout(r, ms));

		////////////////////////////////////////////////////////////////////////
		////// set state as loading while waiting for query results ////////////
		////////////////////////////////////////////////////////////////////////

		// const preShotgunConfirmed = query(...)
		// const availablePersonIds = query(...)

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

			// await availablePersonIds
			const availablePersonIds = ["Tanguy", "Gautier", "Nicolas", "Hugo"]; //hardcoded temporary

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
						shotgunFunction={this.shotgunRoom}
					/>
				);
		}
	}
}

export default ShotgunContainer;
