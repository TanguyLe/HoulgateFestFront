import React from "react";
import {ROOM_SEATS_DISPLAY_INDEX_PREFIX} from "../constants";

class RoomBasis extends React.Component {
    render() {
        let preDisplay = [];

        if (this.props.seats) {
            preDisplay = [<br/>, this.props.seats + " places", <br/>];
        }
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #353535",
                    gridColumnStart: this.props.position.columnStart,
                    gridColumnEnd: this.props.position.columnEnd,
                    gridRowStart: this.props.position.rowStart,
                    gridRowEnd: this.props.position.rowEnd
                }}
            >
                {this.props.name}
                {preDisplay.map((e, i) => {
                    return (
                        <div key={ROOM_SEATS_DISPLAY_INDEX_PREFIX + this.props.name + i}>
                            {e}
                        </div>
                    );
                })}
                {this.props.children}
            </div>
        );
    }
}

export default RoomBasis;
