import React from "react";
import { map } from "lodash/fp";

import Floor from "./Floor";
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
					console.log(floor);
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
		console.log("ShotGun");
		console.log(room, floor);

		room["state"] = "loading";
		floor["rooms"] = [
			...map(room => {
				room["state"] = "disabled";
				return room;
			}, floor.rooms),
			room
		];
		this.setState({
			shotgunPhase: "waitingForConfirm",
			room: room,
			floor: floor
		});

		// await availablePersonIds
		const availablePersonIds = ["Tanguy", "Gautier", "Nicolas", "Hugo"];
		room["state"] = "attributingBeds";
		room["availablePersonIds"] = availablePersonIds;
		floor["rooms"] = [...floor.rooms, room];
		console.log(floor);
		this.setState({
			shotgunPhase: "attributingBeds",
			room: room,
			floor: floor
		});
	}
	render() {
		let floorContainerStyle = {
			margin: "0 5px 0 5px",
			display: "float",
			position: "relative",
			height: "50%",
			width: "calc(50% - 10px)"
		};

		const DisplayAllRooms = () => (
			<div
				style={{
					height: "calc(100% - 50px)",
					width: "100%",
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap"
				}}
			>
				{villaLesGenets.floors.map((floor, index) => {
					return (
						<div
							key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index}
							style={floorContainerStyle}
						>
							<Floor
								floorData={floor}
								shotgunFunction={(event, room) =>
									this.shotgunRoom(event, room, floor)
								}
							/>
						</div>
					);
				})}
			</div>
		);

		switch (this.state.shotgunPhase) {
			case "preShotgun":
				return <DisplayAllRooms />;

			case "waitingForConfirm":
				console.log("1", this.state.floor);
				return <Floor floorData={this.state.floor} />;

			case "attributingBeds":
				console.log("2", this.state.floor);
				return <Floor floorData={this.state.floor} />;
			default:
				return <DisplayAllRooms />;
		}
	}
}

export default ShotgunContainer;
