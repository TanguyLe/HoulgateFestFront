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
			<div>
				J'ai jamais aimé les abricots de toute façon.
				<GroundFloor/>
				<FirstFloor/>
				<SecondFloor/>
				<GardenFloor/>
			</div>);
	}
}

export default Dummy;
