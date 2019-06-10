import React from "react";
import RoomBasis from "./RoomBasis";
import ShotgunPortal from "./ShotgunModal";

class RoomAttributingBeds extends React.Component {
    render() {
        return (
            <RoomBasis {...this.props}>
                <ShotgunPortal
                    status={"attributingBeds"}
                    numberOfBeds={this.props.numberOfBeds}
                    availablePersonIds={this.props.availablePersonIds}
                    onSubmit={this.props.onSubmit}
                    validationFunction={this.props.addPersonsInShotgunFunction}
                />
            </RoomBasis>
        );
    }
}

export default RoomAttributingBeds;
