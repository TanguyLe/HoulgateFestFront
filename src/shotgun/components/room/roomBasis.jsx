import React from "react";

import { Icon } from "../../../ui";
import { BEDROOM_TYPE, GARDEN_TYPE, LIVING_ROOM_TYPE } from "../../constants";

const TYPE_ICONS = { [BEDROOM_TYPE]: "bed", [LIVING_ROOM_TYPE]: "sofa", [GARDEN_TYPE]: "tent" };

const STATUS_LABELS = {
    free: "Libre",
    locked: "Libre",
    pending: "Pré-shotgun",
    minePending: "À finaliser",
    taken: "Complet",
    mine: "Ta chambre",
    loading: "Chargement",
};

export const initials = (name = "") =>
    name
        .split(/[\s._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "?";

// A room as a card: who sleeps there, how many beds are left and what can be done with it
class RoomBasis extends React.Component {
    constructor() {
        super();

        this.getUsername = this.getUsername.bind(this);
    }

    getUsername(userId) {
        const user = this.props.userInfo[userId];
        return user ? user.username : "?";
    }

    render() {
        const { name, seats, type, tone = "free", user, roommates, timer, children } = this.props;

        const owner = user ? this.getUsername(user) : null;
        const mates = roommates ? roommates.map(this.getUsername) : [];
        const occupants = owner ? [owner, ...mates] : [];
        const emptySeats = Math.max(0, seats - occupants.length);

        return (
            <article className={"room tone-" + tone} aria-label={name}>
                <header className="room__head">
                    <span className="room__icon" aria-hidden="true">
                        <Icon name={TYPE_ICONS[type] || "bed"} size={22} />
                    </span>
                    <div className="room__titles">
                        <h3 className="room__name">{name}</h3>
                        <span className="room__seats">
                            {seats} {seats > 1 ? "places" : "place"}
                        </span>
                    </div>
                    <span className="room__status">{STATUS_LABELS[tone]}</span>
                </header>

                <div className="room__beds" aria-label={occupants.length + " sur " + seats}>
                    {occupants.map((username, index) => (
                        <span
                            key={username + index}
                            className={
                                "room__bed room__bed--taken" +
                                (index === 0 ? " room__bed--owner" : "")
                            }
                            title={username}
                        >
                            {initials(username)}
                        </span>
                    ))}
                    {Array.from({ length: emptySeats }).map((_, index) => (
                        <span key={"empty" + index} className="room__bed" aria-hidden="true" />
                    ))}
                </div>

                {owner ? (
                    <p className="room__people">
                        par <b>{owner}</b>
                        {mates.length ? <span> · avec {mates.join(", ")}</span> : null}
                    </p>
                ) : (
                    <p className="room__people room__people--empty">Personne pour l’instant</p>
                )}

                {timer ? <div className="room__timer">{timer}</div> : null}
                {children ? <div className="room__action">{children}</div> : null}
            </article>
        );
    }
}

export default RoomBasis;
