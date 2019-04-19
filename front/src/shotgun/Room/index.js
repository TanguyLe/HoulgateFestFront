import React from "react";
import {isNil, get} from "lodash/fp";

import RoomBasis from "./RoomBasis";
import ShotgunPortal from "./ShotgunModal";
import {
    ROOM_STATUS_LOADING,
    ROOM_STATUS_SHOTGUNNED,
    ROOM_STATUS_PRESHOTGUNNED
} from "../constants";


class Room extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ||
            (JSON.stringify(nextState) !== JSON.stringify(this.state))
    }

    render() {
        let buttonType = "blue";
        let content = "Shotgun!";
        let disable = false;

        const roomId = this.props.id;
        const roomStatus = this.props.roomStatus;

        const shotgunOnGoingForUser = (this.props.userState.hasPreShotgun || this.props.userState.hasShotgun);
        const isUserRoom = shotgunOnGoingForUser ? roomId === this.props.userState.room : false;

        let finalStatus =  roomStatus;

        /**
         * Logic here is rather simple in the end :
         * 1) Room is shotgunned
         *  a. By the user => Successful green button
         *  b. By someone else => Disabled red button
         * 2) Room is preShotgunned
         *  a. By the user => Encouraging blue button
         *  b. By someone else => Disabled orange button
         * 3) Room is loading => Disabled grey button
         * 4) Room is ready (means empty)
         *  a. User is taken => Disabled blue button
         *  b. User is free => Enable blue button
         */

        if (roomStatus === ROOM_STATUS_SHOTGUNNED) {
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
        else if (roomStatus === ROOM_STATUS_PRESHOTGUNNED) {
            if (isUserRoom) {
                content = "Finalise ton shotgun!";
                finalStatus = "attributingBeds";
            }
            else {
                buttonType = "orange";
                content = "Shotgun en cours...";
                disable = true;
            }
        }
        else if (roomStatus === ROOM_STATUS_LOADING){
            buttonType = "grey";
            content = "Chargement...";
            disable = true;
        }
        else if (shotgunOnGoingForUser) {
            // Remaining state is readyForShotgun, the case where no shotgun
            // is ongoing for the user is handled by the default
            disable = true;
        }

        return (
            <RoomBasis
                {...this.props}
                seats={this.props.seats}
                position={this.props.position}
                name={this.props.name}
                user={this.props.user}
                roommates={this.props.roommates}
                userInfo={this.props.userInfo}
            >
                {this.props.seats > 0 ?
                    <ShotgunPortal
                        disabled={disable}
                        content={content}
                        buttonType={buttonType}
                        seats={this.props.seats}
                        name={this.props.name}
                        status={finalStatus}
                        availablePersons={this.props.availablePersons}
                        createShotgunFunction={this.props.createShotgunFunction || null}
                        addPersonsInShotgunFunction={roommatesIds =>
                            this.props.addPersonsInShotgunFunction(this.props.id, roommatesIds)
                        }
                    /> : ""}
            </RoomBasis>
        );
    }
}

export default Room;
