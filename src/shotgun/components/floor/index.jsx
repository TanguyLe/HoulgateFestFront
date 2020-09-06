import React from "react";

import Room from "../room";
import { ROOM_GRID_STRUCT_INDEX_PREFIX } from "../../constants";

export class Floor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            gridHeight: "calc(100% - 60px)",
            gridWidth: "100%",
        };

        this.floorId = props.floorData.name;
        this.calcSizes = this.calcSizes.bind(this);
        this.onResize = this.onResize.bind(this);

        this.resizing = false;
        this.widthHeightRatio = props.floorData.size.width / props.floorData.size.height;
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
        let currentFullWidth = this.floor.clientWidth;
        let currentFullHeight = this.floor.clientHeight - 60;

        let associatedHeight = currentFullWidth / this.widthHeightRatio;
        let associatedWidth = currentFullHeight * this.widthHeightRatio;

        if (associatedHeight > currentFullHeight) this.setState({ gridWidth: associatedWidth });
        else this.setState({ gridHeight: associatedHeight });
    }

    componentDidMount() {
        window.addEventListener("resize", this.onResize);
        this.floor = document.getElementById(this.floorId);
        this.calcSizes();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
            JSON.stringify(nextState) !== JSON.stringify(this.state)
        );
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
            width: this.state.gridWidth,
        };

        let isBigFloor =
            this.props.floorData.name === "Rdc" || this.props.floorData.name === "Premier Etage";

        return (
            <div
                className={isBigFloor ? "bigFloorContainer" : "smallFloorContainer"}
                id={this.floorId}
            >
                <div className="floorTitle">
                    <b>{this.props.floorData.name}</b>
                </div>
                <div style={gridStyle}>
                    {this.props.floorData.rooms.map((room, index) => {
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
                                key={
                                    ROOM_GRID_STRUCT_INDEX_PREFIX +
                                    this.props.floorData.name +
                                    index
                                }
                                position={position}
                                roomStatus={room.status}
                                user={room.user}
                                roommates={room.roommates}
                                userInfo={this.props.userInfo}
                                createShotgunFunction={(event) =>
                                    this.props.createShotgunFunction(event, room._id)
                                }
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
