import React from "react";
import { map } from "lodash/fp";
const mapUncapped = map.convert({ cap: false });

import Floor from "./";
import { villaLesGenets } from "../villaLesGenetsDef";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "../constants";

class DisplayAllFloors extends React.Component {
    render() {
        let floorContainerStyle = {
            margin: "0 5px 0 5px",
            display: "float",
            position: "relative",
            height: "50%",
            width: "calc(50% - 10px)"
        };

        return (
            <div
                style={{
                    height: "calc(100% - 50px)",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap"
                }}
            >
                {mapUncapped((floor, index) => {
                    return (
                        <div key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index} style={floorContainerStyle}>
                            <Floor
                                floorData={floor}
                                createShotgunFunction={(event, room) =>
                                    this.props.createShotgunFunction(event, room, floor)
                                }
                            />
                        </div>
                    );
                }, villaLesGenets.floors)}
            </div>
        );
    }
}

export default DisplayAllFloors;
