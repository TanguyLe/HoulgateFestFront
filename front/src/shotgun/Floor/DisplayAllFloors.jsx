import React from "react";
import { map } from "lodash/fp";

const mapUncapped = map.convert({ cap: false });

import Floor from "./";
import { villaLesGenets } from "../villaLesGenetsDef";
import { FLOOR_GRID_STRUCT_INDEX_PREFIX } from "../constants";

class DisplayAllFloors extends React.Component {
  render() {
    return (
      <div className="allFloors">
        {mapUncapped((floor, index) => {
          return (
            <Floor
              key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index}
              floorData={floor}
              availablePersonsIds={this.props.availablePersonsIds}
              userState={this.props.userState}
              createShotgunFunction={(event, room) =>
                this.props.createShotgunFunction(event, room, floor)
              }
              addPersonsInShotgunFunction={
                this.props.addPersonsInShotgunFunction
              }
            />
          );
        }, this.props.floors)}
      </div>
    );
  }
}

export default DisplayAllFloors;
