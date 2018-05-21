import React from "react";
import RoomBasis from "./RoomBasis";
import MultipleDropdown from "../MultipleDropdown";

class RoomAttributingBeds extends React.Component {
    render() {
        return (
            <RoomBasis {...this.props}>
                <MultipleDropdown
                    numberOfBeds={this.props.seats}
                    availablePersonIds={this.props.availablePersonIds}
                    validationFunction={this.props.addPersonsInShotgunFunction}
                />
            </RoomBasis>
        );
    }
}

export default RoomAttributingBeds;
