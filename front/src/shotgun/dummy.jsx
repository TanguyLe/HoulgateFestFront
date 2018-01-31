import React from "react";

import FirstFloor from "./Floors/FirstFloor"
import GroundFloor from "./Floors/GroundFloor"
import SecondFloor from "./Floors/SecondFloor"
import GardenFloor from "./Floors/Garden.jsx"
import {villaLesGenets} from "./villaLesGenetsDef"
import {getNbSeats} from "./roomUtils"

console.log(getNbSeats(villaLesGenets));

class Dummy extends React.Component {
	render() {
		return(
			<div style={{height: "calc(100% - 50px)", width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                <div style={{margin: "0 10px 0 10px", display: "float", position: "relative", height: "40%", width: "40%"}}>
                    <GroundFloor/>
                </div>
                <div style={{margin: "0 10px 0 10px", display: "float", position: "relative", height: "40%", width: "40%"}}>
                    <FirstFloor/>
                </div>
                <div style={{margin: "0 10px 0 10px", display: "floatLeft", position: "relative", height: "40%", width: "40%"}}>
                    <SecondFloor/>
                </div>
                <div style={{margin: "0 10px 0 10px", display: "floatLeft", position: "relative", height: "40%", width: "40%"}}>
                    <GardenFloor/>
                </div>
			</div>);
	}
}

export default Dummy;
