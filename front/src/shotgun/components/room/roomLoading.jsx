import React from "react";
import RoomBasis from "./roomBasis";
import ShotgunPortal from "../shotgunModal";

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
