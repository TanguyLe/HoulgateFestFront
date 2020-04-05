import React from "react";
import ShotgunPortal from "./shotgunModal";

import RoomBasis from "./roomBasis";

class RoomReadyForShotgun extends React.Component {
    render() {
        return (
            <RoomBasis {...this.props}>
                <ShotgunPortal
                    status={"readyForShotgun"}
                    numberOfBeds={this.props.numberOfBeds}
                    availablePersonIds={this.props.availablePersonIds}
                    createShotgunFunction={this.props.createShotgunFunction}
                />
            </RoomBasis>
        );
    }
}

export default RoomReadyForShotgun;
