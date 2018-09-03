import React from "react";
import {isNil, get} from "lodash/fp";

import RoomBasis from "./RoomBasis";
import ShotgunPortal from "./ShotgunModal";

class Room extends React.Component {
    render() {
        let content = "";
        let disable = false;
        let status = this.props.roomState;

        if (this.props.seats > 0) {
            if (this.props.roomState === "disabled") {
                content = "DISABLED";
                disable = true;
            } else if (this.props.userState.hasShotgun === true) {
                if (get("roomId", this.props) === this.props.userState.room) {
                    status = "shotgunSuccessful";
                    content = "You have already shotgun this room";
                } else {
                    content = "You have already shotgunned";
                    disable = true;
                }
            } else if (this.props.userState.isShotgun === true) {
                if (get("roomId", this.props) === this.props.userState.room) {
                    status = "attributingBeds";
                    content =
                        "You have the priority on this room, hurry up before timeout";
                } else {
                    content = "You have a shotgun in progress";
                    disable = true;
                }
            } else if (this.props.roomState === "shotguned") {
                content = "Room already shotgunned";
                disable = true;
            } else {
                status = this.props.roomState;
            }
        }

        return (
            <RoomBasis
                {...this.props}
                seats={this.props.seats}
                position={this.props.position}
                name={this.props.name}
            >
                {content}
                <ShotgunPortal
                    disabled={disable || !this.props.seats}
                    seats={this.props.seats}
                    name={this.props.name}
                    status={status}
                    availablePersonsIds={this.props.availablePersonsIds}
                    createShotgunFunction={this.props.createShotgunFunction || null}
                    addPersonsInShotgunFunction={roommatesIds =>
                        this.props.addPersonsInShotgunFunction(
                            this.props.name,
                            roommatesIds
                        )
                    }
                />
            </RoomBasis>
        );
    }
}

export default Room;
