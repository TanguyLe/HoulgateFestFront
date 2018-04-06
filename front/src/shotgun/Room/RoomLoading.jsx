import React from "react";
import RoomBasis from "./RoomBasis";

class RoomLoading extends React.Component {
	render() {
		return (
			<RoomBasis {...this.props}>
				<div>LOADING</div>
			</RoomBasis>
		);
	}
}

export default RoomLoading;
