import React from "react";

import Floor from "./index";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX, ROOM_STATUS_READY } from "../../constants";

const Legend = () => (
    <ul className="shotgun-legend" aria-label="Légende">
        <li>
            <span className="chip chip--free">Libre</span>
        </li>
        <li>
            <span className="chip chip--pending">Shotgun en cours</span>
        </li>
        <li>
            <span className="chip chip--taken">Complet</span>
        </li>
        <li>
            <span className="chip chip--mine">Ta chambre</span>
        </li>
    </ul>
);

class DisplayAllFloors extends React.Component {
    render() {
        const rooms = this.props.floors.flatMap((floor) =>
            floor.rooms.filter((room) => room && room.seats > 0),
        );
        const freeRooms = rooms.filter((room) => room.status === ROOM_STATUS_READY);
        const freeSeats = freeRooms.reduce((total, room) => total + room.seats, 0);

        return (
            <div className="shotgun-board">
                <div className="shotgun-board__summary">
                    <span className="sticker sticker--mint" style={{ "--tilt": "-2deg" }}>
                        {freeRooms.length} pièce{freeRooms.length > 1 ? "s" : ""} libre
                        {freeRooms.length > 1 ? "s" : ""} · {freeSeats} places
                    </span>
                    <Legend />
                </div>
                <div className="allFloors">
                    {this.props.floors.map((floor, index) => {
                        return (
                            <Floor
                                key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index}
                                floorData={floor}
                                userInfo={this.props.userInfo}
                                createShotgunFunction={(event, room) =>
                                    this.props.createShotgunFunction(event, room, floor)
                                }
                                addPersonsInShotgunFunction={this.props.addPersonsInShotgunFunction}
                                cancelShotgunFunction={this.props.cancelShotgunFunction}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default DisplayAllFloors;
