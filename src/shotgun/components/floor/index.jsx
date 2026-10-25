import React from "react";

import Room from "../room";
import { ROOM_GRID_STRUCT_INDEX_PREFIX, ROOM_STATUS_READY } from "../../constants";

const BIG_FLOORS = ["Rdc", "Premier Etage"];

export class Floor extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    render() {
        const { floorData } = this.props;

        // The plan keeps the real proportions of the floor, CSS does the sizing
        const gridStyle = {
            gridTemplateRows: floorData.gridTemplate.rows,
            gridTemplateColumns: floorData.gridTemplate.columns,
            aspectRatio: floorData.size.width + " / " + floorData.size.height,
        };

        const freeSeats = floorData.rooms
            .filter((room) => room.status === ROOM_STATUS_READY)
            .reduce((total, room) => total + room.seats, 0);

        const isBigFloor = BIG_FLOORS.includes(floorData.name);

        return (
            <section className={"floor" + (isBigFloor ? " floor--big" : " floor--small")}>
                <header className="floor__header">
                    <h3>{floorData.name}</h3>
                    <span className={"floor__free" + (freeSeats ? "" : " is-full")}>
                        {freeSeats ? freeSeats + " libres" : "complet"}
                    </span>
                </header>
                <div className="floor__plan" style={gridStyle}>
                    {floorData.rooms.map((room, index) => {
                        let position = {
                            rowStart: room.gridPosition.rows.start,
                            rowEnd: room.gridPosition.rows.end,
                            columnStart: room.gridPosition.columns.start,
                            columnEnd: room.gridPosition.columns.end,
                        };

                        return (
                            <Room
                                id={room._id}
                                name={room.name}
                                seats={room.seats}
                                key={ROOM_GRID_STRUCT_INDEX_PREFIX + floorData.name + index}
                                position={position}
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
                        );
                    })}
                </div>
            </section>
        );
    }
}

export default Floor;
