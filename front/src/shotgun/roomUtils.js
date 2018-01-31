import React from "react";

import Room from "./Room";
import {ROOM_GRID_STRUCT_INDEX_PREFIX} from "./constants";


export const getNbSeats = (place) => {
    let nbSeats = 0;

    place.floors.map((floor) => {
        floor.rooms.map((room) => {
            nbSeats += room.seats;
        })
    });

    return nbSeats;
};


export class FloorGridStruct extends React.Component {
    render() {
        let gridStyle = {
            display: "grid",
            gridTemplateRows: this.props.floor.gridTemplate.rows,
            gridTemplateColumns: this.props.floor.gridTemplate.columns,
            justifyItems: "stretch",
            alignItems: "center",
            justifyContent: "stretch",
            alignContent: "center"
        };

        return (
            <div className="fullHeight fullWidth">
                {this.props.floor.name}
                <div style={gridStyle}>
                    {this.props.floor.rooms.map((room, index) => {
                        let position = {
                            rowStart: room.gridPosition.rows.start,
                            rowEnd: room.gridPosition.rows.end,
                            columnStart: room.gridPosition.columns.start,
                            columnEnd: room.gridPosition.columns.end
                        };

                        return(
                            <Room name={room.name}
                                  seats={room.seats}
                                  key={ROOM_GRID_STRUCT_INDEX_PREFIX + this.props.floor.name + index}
                                  position={position}/>
                        );
                    })}
                </div>
            </div>);
    }
}
