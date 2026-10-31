import React from "react";

import Room from "../room";
import { ROOM_GRID_STRUCT_INDEX_PREFIX } from "../../constants";

const FLOOR_LABELS = {
    Rdc: "Rez-de-chaussée",
    "Premier Etage": "Premier étage",
    "Deuxième Etage": "Deuxième étage",
    Extérieur: "Extérieur",
};

export class Floor extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    render() {
        const { floorData } = this.props;
        // Only the rooms with beds can be shotgun: corridors and kitchens stay off the cards
        const rooms = floorData.rooms.filter((room) => room && room.seats > 0);
        if (!rooms.length) return null;

        const seats = rooms.reduce((total, room) => total + room.seats, 0);

        return (
            <section className="floor" aria-labelledby={"floor-" + floorData.name}>
                <h2 className="floor__title" id={"floor-" + floorData.name}>
                    <span>{FLOOR_LABELS[floorData.name] || floorData.name}</span>
                    <span className="floor__count">
                        {rooms.length} {rooms.length > 1 ? "pièces" : "pièce"} · {seats} places
                    </span>
                </h2>
                <div className="rooms">
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
