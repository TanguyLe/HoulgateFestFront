import React from "react";
import {isNil} from "lodash/fp";

import RoomBasis from "./RoomBasis";
import ShotgunPortal from "./ShotgunModal";

class Room extends React.Component {
    render() {
        return (
            <RoomBasis {...this.props} seats={this.props.seats} position={this.props.position} name={this.props.name}>
                {this.props.shotgunState === "disabled" ? "DISABLED": ""}
                <ShotgunPortal
                    disabled={this.props.shotgunState === "disabled" || !this.props.seats}
                    seats={this.props.seats}
                    name={this.props.name}
                    status={this.props.shotgunState}
                    availablePersonIds={this.props.availablePersonIds}
                    createShotgunFunction={this.props.createShotgunFunction || null}
                    addPersonsInShotgunFunction={(roommatesIds) =>
                        this.props.addPersonsInShotgunFunction(this.props.name, roommatesIds)}
                />
            </RoomBasis>
        );
    }
}

export default Room;
