import React from "react";

import Room from "../room";
import { ROOM_GRID_STRUCT_INDEX_PREFIX, ROOM_STATUS_READY } from "../../constants";

const FLOOR_LABELS = {
    Rdc: "Rez-de-chaussée",
    "Premier Etage": "1er étage",
    "Deuxième Etage": "2e étage",
    Extérieur: "Extérieur",
};

// Only the rooms with places can be shotgun: the corridors, stairs & co aren't shown
export const getBookableRooms = (floor) => floor.rooms.filter((room) => room && room.seats > 0);

export class Floor extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    render() {
        const { floorData, index } = this.props;
        const rooms = getBookableRooms(floorData);
        const seats = rooms.reduce((total, room) => total + room.seats, 0);
        const freeSeats = rooms
            .filter((room) => !room.status || room.status === ROOM_STATUS_READY)
            .reduce((total, room) => total + room.seats, 0);

        return (
            <section className="floor" aria-labelledby={"floor-" + index}>
                <header className="floor__head">
                    <span className="floor__num display" aria-hidden="true">
                        {String(index).padStart(2, "0")}
                    </span>
                    <h2 className="floor__title" id={"floor-" + index}>
                        {FLOOR_LABELS[floorData.name] || floorData.name}
                    </h2>
                    <span className="label floor__free">
                        {freeSeats}/{seats} places libres
                    </span>
                </header>
                <div className="floor__rooms">
                    {rooms.map((room, roomIndex) => (
                        <Room
                            id={room._id}
                            name={room.name}
                            seats={room.seats}
                            key={ROOM_GRID_STRUCT_INDEX_PREFIX + floorData.name + roomIndex}
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
