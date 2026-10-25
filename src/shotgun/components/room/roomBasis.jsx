import React from "react";

const STATE_LABELS = {
    available: "Shotgun !",
    locked: "Libre",
    loading: "…",
    pending: "En cours",
    "pending-mine": "À finaliser",
    taken: "Pris",
    mine: "Ton lit",
};

/**
 * One room of the floor plan. Rooms without seats are drawn as plain architecture,
 * bedrooms as tiles that become a button when the current user can act on them.
 */
class RoomBasis extends React.Component {
    constructor() {
        super();

        this.getUsername = this.getUsername.bind(this);
    }

    getUsername(userId) {
        return this.props.userInfo[userId] ? this.props.userInfo[userId].username : "?";
    }

    render() {
        const { position, name, seats, user, roommates, state, actionLabel, onClick, children } =
            this.props;

        const style = {
            gridColumnStart: position.columnStart,
            gridColumnEnd: position.columnEnd,
            gridRowStart: position.rowStart,
            gridRowEnd: position.rowEnd,
        };

        if (!seats)
            return (
                <div className="room room--space" style={style}>
                    <span className="room__name">{name}</span>
                </div>
            );

        const owner = user ? this.getUsername(user) : null;
        const mates = roommates && roommates.length ? roommates.map(this.getUsername) : [];
        const Tag = onClick ? "button" : "div";

        return (
            <Tag
                type={onClick ? "button" : undefined}
                className="room room--bed"
                data-state={state}
                style={style}
                onClick={onClick}
                title={mates.length ? "Avec : " + mates.join(", ") : undefined}
                aria-label={
                    name + ", " + seats + " places, " + (actionLabel || STATE_LABELS[state])
                }
            >
                <span className="room__status">{STATE_LABELS[state]}</span>
                <span className="room__name">{name}</span>
                <span className="room__seats" aria-hidden>
                    {[...Array(seats).keys()].map((seat) => (
                        <i key={seat} />
                    ))}
                    <b>{seats}</b>
                </span>
                {owner && (
                    <span className="room__owner">
                        {owner}
                        {mates.length ? " +" + mates.length : ""}
                    </span>
                )}
                {children}
            </Tag>
        );
    }
}

export default RoomBasis;
