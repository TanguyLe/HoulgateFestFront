import React from "react";

import Floor from "./Floor";
import {villaLesGenets} from "./villaLesGenetsDef";
import {FLOOR_GRID_STRUCT_INDEX_PREFIX} from "./constants"


class ShotgunContainer extends React.Component {
    render() {
        let floorContainerStyle = {
            margin: "0 5px 0 5px",
            display: "float",
            position: "relative",
            height: "50%",
            width: "calc(50% - 10px)"
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
                            <Floor floorData={floor}/>
                        </div>);
                })}
            </div>);
    }
}

export default ShotgunContainer;
