import React from "react";

import Icon from "../../../ui/icon";
import ShotgunDialog from "../shotgunModal";
import PreShotgunTimer from "../preShotgunTimer";
import { getRoomState } from "../../roomState";

/**
 * One bedroom in the list of its floor: the whole row is the button when the user can act on it.
 * `number` matches the room on the floor plan. The page decides which room's dialog is open,
 * so the status bar can open the user's room too.
 */
class Room extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    getUsername(userId) {
        return this.props.userInfo[userId] ? this.props.userInfo[userId].username : "?";
    }

    render() {
        const { room, number, me, userInfo, open, onOpen } = this.props;
        const view = getRoomState(room, me);

        const people = room.user
            ? [room.user, ...(room.roommates || [])].map((id) => this.getUsername(id))
            : [];
        // only the owner can cancel, the roommates' room is theirs too
        const isOwner = Boolean(me) && room.user === me._id;

        // the API refuses to book accounts that aren't activated, so don't offer them as roommates
        const availablePersons = Object.values(userInfo).filter(
            (person) => (person.activated && person.hasShotgun === false) || person._id === me._id,
        );

        const onClick = view.action
            ? (event) => {
                  onOpen(room._id);
                  if (view.state === "available") this.props.createShotgunFunction(event);
              }
            : undefined;
        const Tag = onClick ? "button" : "div";

        return (
            <li className="room-row" data-state={view.state}>
                <Tag
                    type={onClick ? "button" : undefined}
                    className="room-row__main"
                    onClick={onClick}
                    aria-label={
                        room.name +
                        ", " +
                        room.seats +
                        " lits, " +
                        view.label +
                        (view.action ? " : " + view.action : "")
                    }
                >
                    <span className="room-row__num" aria-hidden>
                        {number}
                    </span>
                    <span className="room-row__body">
                        <span className="room-row__name">{room.name}</span>
                        <span className="room-row__meta">
                            <span>
                                <Icon name="bed" size={14} /> {room.seats}
                            </span>
                            {people.length ? <span>{people.join(", ")}</span> : null}
                            {view.state.startsWith("pending") && room.preShotgunExpiry ? (
                                <PreShotgunTimer
                                    expiry={room.preShotgunExpiry}
                                    label={
                                        view.state === "pending-mine"
                                            ? "il te reste"
                                            : "expire dans"
                                    }
                                />
                            ) : null}
                        </span>
                    </span>
                    <span className="room-row__action">
                        {view.state === "loading" ? <span className="spinner" /> : null}
                        {view.action || view.label}
                        {view.action ? <Icon name="arrowRight" size={16} /> : null}
                    </span>
                </Tag>
                {open && view.dialog && (
                    <ShotgunDialog
                        seats={room.seats}
                        name={room.name}
                        status={view.dialog}
                        availablePersons={availablePersons}
                        roommates={(room.roommates || []).map((id) => this.getUsername(id))}
                        onClose={() => onOpen(null)}
                        addPersonsInShotgunFunction={(roommatesIds) =>
                            this.props.addPersonsInShotgunFunction(room._id, roommatesIds)
                        }
                        cancelShotgunFunction={
                            isOwner ? () => this.props.cancelShotgunFunction(room._id) : null
                        }
                    />
                )}
            </li>
        );
    }
}

export default Room;
