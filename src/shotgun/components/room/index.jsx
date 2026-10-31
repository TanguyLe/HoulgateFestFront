import React from "react";

import ShotgunPortal from "../shotgunModal";
import PreShotgunTimer from "../preShotgunTimer";
import {
    ROOM_STATUS_LOADING,
    ROOM_STATUS_SHOTGUNNED,
    ROOM_STATUS_PRESHOTGUNNED,
    BEDROOM_TYPE,
    LIVING_ROOM_TYPE,
    GARDEN_TYPE,
} from "../../constants";
import { getCredentials, register, unregister } from "../../../login/store";
import { Avatar } from "../../../ui";

const ROOM_EMOJIS = { [BEDROOM_TYPE]: "🛏️", [LIVING_ROOM_TYPE]: "🛋️", [GARDEN_TYPE]: "⛺" };

// The look of the card for each state of the room
const CARD_STATES = {
    free: { chip: "free", label: "Libre" },
    locked: { chip: "free", label: "Libre" },
    pending: { chip: "pending", label: "Shotgun en cours" },
    minePending: { chip: "mine", label: "À finaliser !" },
    taken: { chip: "taken", label: "Complet" },
    mine: { chip: "mine", label: "Ta chambre 🎉" },
    loading: { chip: "info", label: "Chargement..." },
};

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

    getUsername(userId) {
        const user = this.props.userInfo[userId];
        return user ? user.username : "?";
    }

    renderOccupants() {
        const occupants = [this.props.user, ...(this.props.roommates || [])]
            .filter(Boolean)
            .map((userId) => this.getUsername(userId));
        const emptySeats = Math.max(0, this.props.seats - occupants.length);

        return (
            <div className="room-card__people">
                <div className="room-card__seats" aria-hidden="true">
                    {occupants.map((name, index) => (
                        <Avatar key={name + index} name={name} size="sm" />
                    ))}
                    {[...new Array(emptySeats).keys()].map((index) => (
                        <Avatar key={"empty" + index} empty size="sm" title="Place libre" />
                    ))}
                </div>
                {occupants.length > 0 && (
                    <p className="room-card__names">
                        {"par " + occupants[0]}
                        {occupants.length > 1 && (
                            <span className="muted">
                                {" · avec " + occupants.slice(1).join(", ")}
                            </span>
                        )}
                    </p>
                )}
            </div>
        );
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
        // the roommates' room is theirs too, but only the owner can cancel the shotgun
        const isUserOwner = isUserRoom && this.props.user === currentUser._id;

        // the API refuses to book accounts that aren't activated, so don't offer them as roommates
        const availablePersons = users.filter(
            (person) =>
                (person.activated && person.hasShotgun === false) || currentUser._id === person._id,
        );

        let finalStatus = roomStatus;
        let cardState = "free";

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
                cardState = "mine";
            } else {
                buttonType = "red";
                content = "Déjà shotgun";
                disable = true;
                cardState = "taken";
            }
        } else if (roomStatus === ROOM_STATUS_PRESHOTGUNNED) {
            if (isUserRoom) {
                content = "Finalise ton shotgun!";
                finalStatus = "attributingBeds";
                cardState = "minePending";
            } else {
                buttonType = "orange";
                content = "Shotgun en cours...";
                disable = true;
                cardState = "pending";
            }
        } else if (roomStatus === ROOM_STATUS_LOADING) {
            buttonType = "grey";
            content = "Chargement...";
            disable = true;
            cardState = "loading";
        } else if (shotgunOnGoingForUser) {
            // Remaining state is readyForShotgun, the case where no shotgun
            // is ongoing for the user is handled by the default
            disable = true;
            cardState = "locked";
        }

        const look = CARD_STATES[cardState];

        return (
            <article className={"room-card room-card--" + cardState} aria-label={this.props.name}>
                <header className="room-card__head">
                    <span className="room-card__emoji emoji" aria-hidden="true">
                        {ROOM_EMOJIS[this.props.type] || "🛏️"}
                    </span>
                    <div className="room-card__titles">
                        <h3 className="room-card__name">{this.props.name}</h3>
                        <span className="room-card__capacity">{this.props.seats} places</span>
                    </div>
                    <span className={"chip chip--" + look.chip}>{look.label}</span>
                </header>
                {this.renderOccupants()}
                {roomStatus === ROOM_STATUS_PRESHOTGUNNED && this.props.preShotgunExpiry ? (
                    <PreShotgunTimer
                        expiry={this.props.preShotgunExpiry}
                        label={isUserRoom ? "Il te reste" : "Expire dans"}
                    />
                ) : (
                    ""
                )}
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
                        cancelShotgunFunction={
                            isUserOwner
                                ? () => this.props.cancelShotgunFunction(this.props.id)
                                : null
                        }
                    />
                ) : (
                    ""
                )}
            </article>
        );
    }
}

export default Room;
