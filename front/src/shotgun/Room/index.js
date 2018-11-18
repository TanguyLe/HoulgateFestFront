import React from "react";
import {isNil, get} from "lodash/fp";

import RoomBasis from "./RoomBasis";
import ShotgunPortal from "./ShotgunModal";


class Room extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ||
            (JSON.stringify(nextState) !== JSON.stringify(this.state))
    }

    render() {
        let buttonType = "blue";
        let content = "";
        let disable = false;

        const roomId = this.props.id;
        const roomStatus = this.props.roomState;

        const shotgunOnGoing = (this.props.userState.hasPreShotgun || this.props.userState.hasShotgun);
        const isUserRoom = shotgunOnGoing ? roomId === this.props.userState.room : false;

        let finalStatus =  roomStatus;

        if (this.props.seats > 0) {
            if (roomStatus === "shotgunned") {
                if (isUserRoom) {
                        buttonType = "green";
                        content = "C'est ici que tu as shotgun!";
                        finalStatus = "shotgunSuccessful";
                    }
                    else {
                        buttonType = "red";
                        content = "Déjà shotgun";
                        disable = true;
                    }

            }
            else if (roomStatus === "preShotgunned") {
                if (isUserRoom) {
                    content = "Tu as la priorité sur cette pièce, dépêche toi de finaliser ton shotgun!";
                    finalStatus = "attributingBeds";
                }
                else {
                    buttonType = "orange";
                    content = "Shotgun en cours...";
                    disable = true;
                }
            }
            else {
                content = "Shotgun!";

                if (shotgunOnGoing)
                    disable = true;
                else
                    finalStatus = "readyForShotgun";
            }

        }

        return (
            <RoomBasis
                {...this.props}
                seats={this.props.seats}
                position={this.props.position}
                name={this.props.name}
            >
                <ShotgunPortal
                    disabled={disable || !this.props.seats}
                    content={content}
                    buttonType={buttonType}
                    seats={this.props.seats}
                    name={this.props.name}
                    status={finalStatus}
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
