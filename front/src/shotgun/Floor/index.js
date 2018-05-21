import React from "react";

import Room from "../Room";
import { ROOM_GRID_STRUCT_INDEX_PREFIX } from "../constants";

export class Floor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            gridHeight: "calc(100% - 60px)",
            gridWidth: "100%"
        };

        this.floorId = props.floorData.name;
        this.calcSizes = this.calcSizes.bind(this);
        this.onResize = this.onResize.bind(this);

        this.resizing = false;
    }

    onResize() {
        // Reduce the number of resizings, just a matter of performance
        if (this.resizing === false)
            setTimeout(() => {
                if (this.resizing === true) this.resizing = false;
                this.calcSizes();
            }, 100);

        this.resizing = true;
    }

    calcSizes() {
        let currentFullWidth = document.getElementById(this.floorId).clientWidth;
        let currentFullHeight = document.getElementById(this.floorId).clientHeight - 60;

        let widthHeightRatio = this.props.floorData.size.width / this.props.floorData.size.height;

        let associatedHeight = currentFullWidth / widthHeightRatio;
        let associatedWidth = widthHeightRatio * currentFullHeight;

        if (associatedHeight > currentFullHeight) this.setState({ gridWidth: associatedWidth });
        else this.setState({ gridHeight: associatedHeight });
    }

    componentDidMount() {
        window.addEventListener("resize", this.onResize);
        this.calcSizes();
    }

    render() {
        let gridStyle = {
            display: "grid",
            gridTemplateRows: this.props.floorData.gridTemplate.rows,
            gridTemplateColumns: this.props.floorData.gridTemplate.columns,
            maxWidth: "100%",
            maxHeight: "calc(100% - 60px)",
            margin: "auto",
            height: this.state.gridHeight,
            width: this.state.gridWidth
        };
        return (
            <div className="fullHeight fullWidth" id={this.floorId}>
                <div style={{ textAlign: "center" }}>
                    <b>{this.props.floorData.name}</b>
                </div>
                <div style={gridStyle}>
                    {this.props.floorData.rooms.map((room, index) => {
                        let position = {
                            rowStart: room.gridPosition.rows.start,
                            rowEnd: room.gridPosition.rows.end,
                            columnStart: room.gridPosition.columns.start,
                            columnEnd: room.gridPosition.columns.end
                        };

                        return (
                            <Room
                                name={room.name}
                                seats={room.seats}
                                key={ROOM_GRID_STRUCT_INDEX_PREFIX + this.props.floorData.name + index}
                                position={position}
                                shotgunState={room.state}
                                availablePersonIds={room.availablePersonIds}
                                createShotgunFunction={event => this.props.createShotgunFunction(event, room)}
                                addPersonsInShotgunFunction={this.props.addPersonsInShotgunFunction}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Floor;
