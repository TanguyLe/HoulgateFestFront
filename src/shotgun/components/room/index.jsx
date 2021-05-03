import React from "react";

import RoomBasis from "./roomBasis";
import ShotgunPortal from "../shotgunModal";
import {
    ROOM_STATUS_LOADING,
    ROOM_STATUS_SHOTGUNNED,
    ROOM_STATUS_PRESHOTGUNNED,
} from "../../constants";
import { getCredentials, register, unregister } from "../../../login/store";

class Room extends React.Component {
    constructor() {
        super();

        this.state = { username: getCredentials().login };
        this.onLoginChange = this.onLoginChange.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, _) {
        return (
            JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
            JSON.stringify(nextState) !== JSON.stringify(this.state)
        );
    }
    onLoginChange(newCreds) {
        this.setState({ username: newCreds.login });
    }

    componentDidMount() {
        register(this.onLoginChange);
    }

    componentWillUnmount() {
        unregister(this.onLoginChange);
    }

    render() {
        let buttonType = "blue";
        let content = "Shotgun!";
        let disable = false;

        const roomId = this.props.id;
        const roomStatus = this.props.roomStatus;

        const currentUserUsername = this.state.username;
        const users = Object.values(this.props.userInfo);
        const currentUser = users.find((user) => user.username === currentUserUsername);

        const shotgunOnGoingForUser = currentUser.hasPreShotgun || currentUser.hasShotgun;
        const isUserRoom = shotgunOnGoingForUser ? roomId === currentUser.room : false;

        const availablePersons = users.filter(
            (person) => person.hasShotgun === false || currentUser._id === person._id
        );

        let finalStatus = roomStatus;

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
                content = "Validé";
                finalStatus = "shotgunSuccessful";
            } else {
                buttonType = "red";
                content = "Déjà shotgun";
                disable = true;
            }
        } else if (roomStatus === ROOM_STATUS_PRESHOTGUNNED) {
            if (isUserRoom) {
                content = "Finalise ton shotgun!";
                finalStatus = "attributingBeds";
            } else {
                buttonType = "orange";
                content = "Shotgun en cours...";
                disable = true;
            }
        } else if (roomStatus === ROOM_STATUS_LOADING) {
            buttonType = "grey";
            content = "Chargement...";
            disable = true;
        } else if (shotgunOnGoingForUser) {
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
                {this.props.seats > 0 ? (
                    <ShotgunPortal
                        disabled={disable}
                        content={content}
                        buttonType={buttonType}
                        seats={this.props.seats}
                        name={this.props.name}
                        status={finalStatus}
                        availablePersons={availablePersons}
                        createShotgunFunction={this.props.createShotgunFunction || null}
                        addPersonsInShotgunFunction={(roommatesIds) =>
                            this.props.addPersonsInShotgunFunction(this.props.id, roommatesIds)
                        }
                    />
                ) : (
                    ""
                )}
            </RoomBasis>
        );
    }
}

export default Room;
