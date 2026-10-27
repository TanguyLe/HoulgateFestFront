import React from "react";

import Room from "../room";
import { ROOM_GRID_STRUCT_INDEX_PREFIX, ROOM_STATUS_READY } from "../../constants";
import { getRoomState, isBedroom } from "../../roomState";

/**
 * One floor: a schematic plan to find the rooms (decorative, the list says it all) and the
 * list of its bedrooms, numbered like on the plan.
 */
export class Floor extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    render() {
        const { floorData, floorIndex, me } = this.props;
        // floor names have spaces, which aria-labelledby would read as several ids
        const titleId = "floor-title-" + floorIndex;
        const bedrooms = floorData.rooms.filter(isBedroom);
        const numbers = new Map(bedrooms.map((room, index) => [room._id, index + 1]));

        const freeSeats = bedrooms
            .filter((room) => room.status === ROOM_STATUS_READY)
            .reduce((total, room) => total + room.seats, 0);

        // The plan keeps the real proportions of the floor, CSS does the sizing
        const planStyle = {
            gridTemplateRows: floorData.gridTemplate.rows,
            gridTemplateColumns: floorData.gridTemplate.columns,
            aspectRatio: floorData.size.width + " / " + floorData.size.height,
        };

        return (
            <section className="floor" aria-labelledby={titleId}>
                <header className="floor__header">
                    <h2 id={titleId}>{floorData.name}</h2>
                    <span className={"floor__free" + (freeSeats ? "" : " is-full")}>
                        {freeSeats ? freeSeats + " lits libres" : "Complet"}
                    </span>
                </header>
                <div className="floor__plan-wrap" aria-hidden>
                    <div className="floor__plan" style={planStyle}>
                        {floorData.rooms.map((room, index) => {
                            const style = {
                                gridRow:
                                    room.gridPosition.rows.start +
                                    " / " +
                                    room.gridPosition.rows.end,
                                gridColumn:
                                    room.gridPosition.columns.start +
                                    " / " +
                                    room.gridPosition.columns.end,
                            };

                            return isBedroom(room) ? (
                                <span
                                    key={ROOM_GRID_STRUCT_INDEX_PREFIX + floorData.name + index}
                                    className="plan-room"
                                    data-state={getRoomState(room, me).state}
                                    style={style}
                                >
                                    {numbers.get(room._id)}
                                </span>
                            ) : (
                                <span
                                    key={ROOM_GRID_STRUCT_INDEX_PREFIX + floorData.name + index}
                                    className="plan-space"
                                    style={style}
                                />
                            );
                        })}
                    </div>
                </div>
                <ol className="room-list">
                    {bedrooms.map((room) => (
                        <Room
                            key={room._id}
                            room={room}
                            number={numbers.get(room._id)}
                            me={me}
                            userInfo={this.props.userInfo}
                            open={this.props.openRoomId === room._id}
                            onOpen={this.props.onOpenRoom}
                            createShotgunFunction={(event) =>
                                this.props.createShotgunFunction(event, room._id)
                            }
                            addPersonsInShotgunFunction={this.props.addPersonsInShotgunFunction}
                            cancelShotgunFunction={this.props.cancelShotgunFunction}
                        />
                    ))}
                </ol>
            </section>
        );
    }
}

export default Floor;
