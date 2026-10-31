import React from "react";

import Room from "../room";
import { ROOM_GRID_STRUCT_INDEX_PREFIX } from "../../constants";

const FLOOR_LOOKS = {
    Rdc: { label: "Rez-de-chaussée", emoji: "🛋️" },
    "Premier Etage": { label: "Premier étage", emoji: "🛏️" },
    "Deuxième Etage": { label: "Deuxième étage", emoji: "🌙" },
    Extérieur: { label: "Extérieur", emoji: "⛺" },
};

// One floor of the villa: the cards of its rooms having beds
export class Floor extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    render() {
        const { floorData } = this.props;
        const look = FLOOR_LOOKS[floorData.name] || { label: floorData.name, emoji: "🏠" };
        const rooms = floorData.rooms.filter((room) => room && room.seats > 0);
        const seats = rooms.reduce((total, room) => total + room.seats, 0);

        if (!rooms.length) return null;

        return (
            <section className="floor" aria-label={look.label}>
                <h2 className="floor__title">
                    <span className="floor__emoji emoji" aria-hidden="true">
                        {look.emoji}
                    </span>
                    {look.label}
                    <span className="floor__count">{seats} places</span>
                </h2>
                <div className="floor__rooms">
                    {rooms.map((room, index) => (
                        <Room
                            id={room._id}
                            name={room.name}
                            type={room.type}
                            seats={room.seats}
                            key={ROOM_GRID_STRUCT_INDEX_PREFIX + floorData.name + index}
                            roomStatus={room.status}
                            user={room.user}
                            roommates={room.roommates}
                            preShotgunExpiry={room.preShotgunExpiry}
                            userInfo={this.props.userInfo}
                            createShotgunFunction={(event) =>
                                this.props.createShotgunFunction(event, room._id)
                            }
                            addPersonsInShotgunFunction={this.props.addPersonsInShotgunFunction}
                            cancelShotgunFunction={this.props.cancelShotgunFunction}
                        />
                    ))}
                </div>
            </section>
        );
    }
}

export default Floor;
