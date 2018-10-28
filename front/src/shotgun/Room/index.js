import React from "react";
import {isNil, get} from "lodash/fp";

import RoomBasis from "./RoomBasis";
import ShotgunPortal from "./ShotgunModal";


class Room extends React.Component {
    render() {
        let content = "";
        let disable = false;
        let status = this.props.roomState;
        const roomId = this.props.id;

        if (this.props.seats > 0) {
            if (this.props.roomState === "disabled") {
                content = "DISABLED";
                disable = true;
            }
            else if (this.props.userState.hasShotgun) {
                if (roomId === this.props.userState.room) {
                    status = "shotgunSuccessful";
                    content = "It's your room!";
                }
                else {
                    content = "You have already shotgunned";
                    disable = true;
                }
            }
            else if (this.props.userState.isShotgun) {
                if (roomId === this.props.userState.room) {
                    status = "attributingBeds";
                    content = "You have the priority on this room, hurry up before timeout";
                }
                else {
                    content = "You have a shotgun in progress";
                    disable = true;
                }
            }
            else if (this.props.roomState === "shotgunned") {
                content = "Room already shotgunned";
                disable = true;
            }
            else
                status = this.props.roomState;
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
                        this.props.addPersonsInShotgunFunction(this.props.id, roommatesIds)
                    }
                />
            </RoomBasis>
        );
    }
}

export default Room;
