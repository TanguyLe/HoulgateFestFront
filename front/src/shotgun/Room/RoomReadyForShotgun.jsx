import React from "react";
import { Button } from "semantic-ui-react";
import ShotgunPortal from "./ShotgunModal";

import RoomBasis from "./RoomBasis";

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
