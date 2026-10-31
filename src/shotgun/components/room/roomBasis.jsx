import React from "react";

import { Avatar, Tag, cx } from "../../../ui";

// A room as a card: its status, who sleeps there (initials) and the free places
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
        const { name, seats, user, roommates, tone, statusLabel, children } = this.props;

        const occupants = [user, ...(roommates || [])].filter(Boolean).map(this.getUsername);
        const free = Math.max(0, seats - occupants.length);
        const isTaken = !!user;

        return (
            <article className={cx("room", "room--" + (tone || "free"))}>
                <header className="room__head">
                    <h3 className="room__name">{name}</h3>
                    {statusLabel && <Tag tone={tone === "free" ? null : "ink"}>{statusLabel}</Tag>}
                </header>
                <p className="room__meta">
                    <span className="room__seats">{seats}</span> places
                    {isTaken && (
                        <span className="room__count">
                            {" "}
                            · {occupants.length}/{seats} occupées
                        </span>
                    )}
                </p>
                <ul className="room__beds" aria-label="Places">
                    {occupants.map((username, index) => (
                        <li key={username + index}>
                            <Avatar name={username} />
                        </li>
                    ))}
                    {isTaken &&
                        Array.from({ length: free }, (_, index) => (
                            <li key={"free" + index}>
                                <Avatar empty />
                            </li>
                        ))}
                    {!isTaken &&
                        Array.from({ length: seats }, (_, index) => (
                            <li key={"seat" + index}>
                                <span className="room__bed" aria-hidden="true" />
                            </li>
                        ))}
                </ul>
                {isTaken && (
                    <p className="room__who">
                        par <strong>{occupants[0]}</strong>
                        {occupants.length > 1 && <> avec {occupants.slice(1).join(", ")}</>}
                    </p>
                )}
                <div className="room__actions">{children}</div>
            </article>
        );
    }
}

export default RoomBasis;
