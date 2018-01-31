import React from "react";
import glamorous from "glamorous";

import {getGridStruct} from "../roomUtils";
import {villaLesGenets} from "../villaLesGenetsDef";


class Floor extends React.Component {
    render() {
        return getGridStruct(villaLesGenets.floors[3]);
    }
}

export default Floor;
