import React from "react";

import {getGridStruct} from "./roomUtils";
import {villaLesGenets} from "./villaLesGenetsDef";
import {FLOOR_GRID_STRUCT_INDEX_PREFIX} from "./constants"


class Dummy extends React.Component {
    render() {
        let floorContainerStyle = {
            margin: "0 10px 0 10px",
            display: "float",
            position: "relative",
            height: "40%",
            width: "40%"
        };
        return (
            <div style={{
                height: "calc(100% - 50px)",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
            }}>
                {villaLesGenets.floors.map((floor, index) => {
                    return(
                        <div key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index} style={floorContainerStyle}>
                            {getGridStruct(floor)}
                        </div>);
                })}
            </div>);
    }
}

export default Dummy;
