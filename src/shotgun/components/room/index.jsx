import React from "react";

import RoomBasis from "./roomBasis";
import ShotgunDialog from "../shotgunModal";
import PreShotgunTimer from "../preShotgunTimer";
import {
    ROOM_STATUS_LOADING,
    ROOM_STATUS_SHOTGUNNED,
    ROOM_STATUS_PRESHOTGUNNED,
    ROOM_STATUS_READY,
} from "../../constants";
import { getCredentials, register, unregister } from "../../../login/store";

class Room extends React.Component {
    constructor() {
        super();

        this.state = { username: getCredentials().login, open: false };
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
        let tileState = "available";
        let content = "Shotgun !";
        let disable = false;

        const roomId = this.props.id;
        const roomStatus = this.props.roomStatus;

        const currentUserUsername = this.state.username;
        const users = Object.values(this.props.userInfo);
        const currentUser = users.find((user) => user.username === currentUserUsername);

        const shotgunOnGoingForUser = currentUser.hasPreShotgun || currentUser.hasShotgun;
        const isUserRoom = shotgunOnGoingForUser ? roomId === currentUser.room : false;
        // the roommates' room is theirs too, but only the owner can cancel the shotgun
        const isUserOwner = isUserRoom && this.props.user === currentUser._id;

        // the API refuses to book accounts that aren't activated, so don't offer them as roommates
        const availablePersons = users.filter(
            (person) =>
                (person.activated && person.hasShotgun === false) || currentUser._id === person._id,
        );

        let finalStatus = roomStatus;

        /**
         * Logic here is rather simple in the end :
         * 1) Room is shotgunned
         *  a. By the user => "mine", opens the confirmation
         *  b. By someone else => "taken", inert
         * 2) Room is preShotgunned
         *  a. By the user => "pending-mine", opens the beds attribution
         *  b. By someone else => "pending", inert
         * 3) Room is loading => "loading", inert
         * 4) Room is ready (means empty)
         *  a. User is taken => "locked", inert
         *  b. User is free => "available", click shotguns
         */

        if (roomStatus === ROOM_STATUS_SHOTGUNNED) {
            if (isUserRoom) {
                tileState = "mine";
                content = "Voir";
                finalStatus = "shotgunSuccessful";
            } else {
                tileState = "taken";
                disable = true;
            }
        } else if (roomStatus === ROOM_STATUS_PRESHOTGUNNED) {
            if (isUserRoom) {
                tileState = "pending-mine";
                content = "Finalise !";
                finalStatus = "attributingBeds";
            } else {
                tileState = "pending";
                disable = true;
            }
        } else if (roomStatus === ROOM_STATUS_LOADING) {
            tileState = "loading";
            disable = true;
        } else if (shotgunOnGoingForUser) {
            // Remaining state is readyForShotgun, the case where no shotgun
            // is ongoing for the user is handled by the default
            tileState = "locked";
            disable = true;
        }

        const onClick = disable
            ? undefined
            : (event) => {
                  this.setState({ open: true });
                  if (roomStatus === ROOM_STATUS_READY && this.props.createShotgunFunction)
                      this.props.createShotgunFunction(event);
              };

        // The dialog only makes sense once the room is ours, it stays hidden while loading
        const showDialog =
            this.state.open &&
            !disable &&
            (finalStatus === "attributingBeds" || finalStatus === "shotgunSuccessful");

        return (
            <>
                <RoomBasis
                    seats={this.props.seats}
                    position={this.props.position}
                    name={this.props.name}
                    user={this.props.user}
                    roommates={this.props.roommates}
                    userInfo={this.props.userInfo}
                    state={tileState}
                    actionLabel={disable ? null : content}
                    onClick={this.props.seats > 0 ? onClick : undefined}
                >
                    {roomStatus === ROOM_STATUS_PRESHOTGUNNED && this.props.preShotgunExpiry ? (
                        <PreShotgunTimer
                            expiry={this.props.preShotgunExpiry}
                            label={isUserRoom ? "Il te reste" : "Expire dans"}
                        />
                    ) : null}
                </RoomBasis>
                {showDialog && (
                    <ShotgunDialog
                        seats={this.props.seats}
                        name={this.props.name}
                        status={finalStatus}
                        availablePersons={availablePersons}
                        roommates={(this.props.roommates || []).map((id) =>
                            this.props.userInfo[id] ? this.props.userInfo[id].username : "?",
                        )}
                        onClose={() => this.setState({ open: false })}
                        addPersonsInShotgunFunction={(roommatesIds) =>
                            this.props.addPersonsInShotgunFunction(this.props.id, roommatesIds)
                        }
                        cancelShotgunFunction={
                            isUserOwner
                                ? () => this.props.cancelShotgunFunction(this.props.id)
                                : null
                        }
                    />
                )}
            </>
        );
    }
}

export default Room;
