import React from "react";
import glamorous from "glamorous";
import { isNil } from "lodash/fp";

import Button from "../../utils/basics/Button";
import { ROOM_SEATS_DISPLAY_INDEX_PREFIX } from "../constants";

import MultipleDropdown from "./multipleDropdown";

class Room extends React.Component {
	constructor(props) {
		super(props);

		if (isNil(props.shotgunState)) {
			this.state = {
				status: "readyForShotgun"
			};
		} else {
			this.state = { status: props.shotgunState };
		}

		this.onClickShotgun = this.onClickShotgun.bind(this);
	}

	onClickShotgun() {
		var wait = ms => new Promise((r, j) => setTimeout(r, ms));

		this.props.shotgunFunction();
		this.setState({ status: "loading" });
		wait(5000);
		this.setState({
			status: "preShotgun",
			persons: ["Tanguy", "Gautier", "Nicolas", "Hugo"]
		});
	}

	render() {
		let display = "";
		let preDisplay = [];

		if (this.props.seats) {
			preDisplay = [<br />, this.props.seats + " places", <br />];
		}

		const RoomBasis = props => (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					border: "1px solid #353535",
					gridColumnStart: this.props.position.columnStart,
					gridColumnEnd: this.props.position.columnEnd,
					gridRowStart: this.props.position.rowStart,
					gridRowEnd: this.props.position.rowEnd
				}}
			>
				{this.props.name}
				{preDisplay.map((e, i) => {
					return (
						<div
							key={
								ROOM_SEATS_DISPLAY_INDEX_PREFIX +
								this.props.name +
								i
							}
						>
							{e}
						</div>
					);
				})}
				{props.children}
			</div>
		);

		const RoomReadyForShotgun = () => (
			<RoomBasis>
				<Button onClick={this.onClickShotgun}>Shotgun !</Button>
			</RoomBasis>
		);

		const RoomDisabled = () => (
			<RoomBasis>
				<div>DISABLED</div>
			</RoomBasis>
		);

		const RoomLoading = () => (
			<RoomBasis>
				<div>LOADING</div>
			</RoomBasis>
		);

		const RoomAttributingBeds = () => (
			<RoomBasis>
				<MultipleDropdown
					numberOfBeds={3}
					availablePersonIds={this.props.availablePersonIds}
				/>
			</RoomBasis>
		);

		switch (this.state.status) {
			case "disabled":
				return <RoomDisabled />;
			case "readyForShotgun":
				return <RoomReadyForShotgun />;
			case "loading":
				return <RoomLoading />;
			case "attributingBeds":
				return <RoomAttributingBeds />;

			default:
				return <RoomReadyForShotgun />;
		}
	}
}

export default Room;
