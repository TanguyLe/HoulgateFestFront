import React from "react";
import RoomBasis from "./RoomBasis";
import ShotgunPortal from "./ShotgunModal";

class RoomLoading extends React.Component {
    render() {
        return (
            <RoomBasis {...this.props}>
                <ShotgunPortal status={"loading"}/>
                <div>LOADING</div>
            </RoomBasis>
        );
    }
}

export default RoomLoading;
