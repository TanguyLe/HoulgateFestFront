import React from "react";
import RoomBasis from "./RoomBasis";
import Button from "../../utils/basics/Button";

class RoomReadyForShotgun extends React.Component {
	render() {
		return (
			<RoomBasis {...this.props}>
				<Button onClick={this.props.onClickShotgun}>Shotgun !</Button>
			</RoomBasis>
		);
	}
}

export default RoomReadyForShotgun;
