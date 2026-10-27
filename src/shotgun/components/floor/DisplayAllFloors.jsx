import React from "react";

import Floor from "./index";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "../../constants";

const DisplayAllFloors = ({ floors, createShotgunFunction, ...floorProps }) => (
    <div className="floors">
        {floors.map((floor, index) => (
            <Floor
                key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index}
                floorData={floor}
                createShotgunFunction={(event, room) => createShotgunFunction(event, room, floor)}
                {...floorProps}
            />
        ))}
    </div>
);

export default DisplayAllFloors;
