import React from "react";

import Room from "../Room";
import {ROOM_GRID_STRUCT_INDEX_PREFIX} from "../constants";
import TextBlock from "../../utils/basics/TextBlock"


export class Floor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            gridHeight: ""
        };

        this.floorId =  props.floorData.name;
        this.calcSizes = this.calcSizes.bind(this);
        this.onResize = this.onResize.bind(this);

        this.resizing = false;
    }
    onResize() {
        // Reduce the number of resizings, just a matter of performance
        if(this.resizing === false)
            setTimeout(()=>{
                if(this.resizing === true)
                    this.resizing = false;
                    this.calcSizes();
            }, 100);

        this.resizing = true;
    }
    calcSizes() {
        // Should be improved to find the optimum
        // Right now it only maximises the width and then scale the height, could be great to maximize both
        // Or actually scale the whole thing to a common scale... But maximizing's great to see as much as possible
        // N.B: It doesn't overflow even if the height is too big after scaling because of maxHeight properties,
        // But if good scaling was the target, proportions are lost in this case => finding the optimum
        let currentFullWidth = document.getElementById(this.floorId).clientWidth;
        this.setState({gridHeight: this.props.floorData.size.height * currentFullWidth / this.props.floorData.size.width});
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
            height: this.state.gridHeight
            // justifyItems: "stretch",
            // alignItems: "center",
            // justifyContent: "stretch",
            // alignContent: "center"
        };

        return (
            <div className="fullHeight fullWidth" id={this.floorId}>
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
