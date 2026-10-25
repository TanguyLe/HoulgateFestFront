import React from "react";

import Floor from "./index";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "../../constants";

const DisplayAllFloors = ({
    floors,
    userInfo,
    createShotgunFunction,
    addPersonsInShotgunFunction,
    cancelShotgunFunction,
}) => (
    <div className="floors">
        {floors.map((floor, index) => (
            <Floor
                key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index}
                floorData={floor}
                userInfo={userInfo}
                createShotgunFunction={(event, room) => createShotgunFunction(event, room, floor)}
                addPersonsInShotgunFunction={addPersonsInShotgunFunction}
                cancelShotgunFunction={cancelShotgunFunction}
            />
        ))}
    </div>
);

export default DisplayAllFloors;
