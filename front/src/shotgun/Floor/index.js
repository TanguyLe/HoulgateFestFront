import React from "react";

import Room from "../Room";
import {ROOM_GRID_STRUCT_INDEX_PREFIX} from "../constants";
import TextBlock from "../../utils/basics/TextBlock"


export class Floor extends React.Component {
    render() {
        let gridStyle = {
            display: "grid",
            gridTemplateRows: this.props.floorData.gridTemplate.rows,
            gridTemplateColumns: this.props.floorData.gridTemplate.columns,
            justifyItems: "stretch",
            alignItems: "center",
            justifyContent: "stretch",
            alignContent: "center"
        };

        return (
            <div className="fullHeight fullWidth">
                <TextBlock style={{textAlign: "center"}}><b>{this.props.floorData.name}</b></TextBlock>
                <div style={gridStyle}>
                    {this.props.floorData.rooms.map((room, index) => {
                        let position = {
                            rowStart: room.gridPosition.rows.start,
                            rowEnd: room.gridPosition.rows.end,
                            columnStart: room.gridPosition.columns.start,
                            columnEnd: room.gridPosition.columns.end
                        };

                        return(
                            <Room name={room.name}
                                  seats={room.seats}
                                  key={ROOM_GRID_STRUCT_INDEX_PREFIX + this.props.floorData.name + index}
                                  position={position}/>
                        );
                    })}
                </div>
            </div>);
    }
}

export default Floor;
