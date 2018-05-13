import React from "react";

import {shotgunDate} from "../constants"
import Countdown from "./CountDown"

import OnlyWhenConnectedWrapper from "../../utils/login/OnlyWhenConnectedWrapper"


class Dummy extends React.Component {
    constructor(){
        super();

        this.forceUpdate = this.forceUpdate.bind(this);
    }
	render() {
		return Date.now() < Date.parse(shotgunDate) ?
            <OnlyWhenConnectedWrapper>
                <div className="Countdown">Ouverture du Shotgun des chambres: </div>
                <Countdown onTime={this.forceUpdate} date={shotgunDate}/>
            </OnlyWhenConnectedWrapper>
            : <div>Shotgun time!</div>;
	}
}

export default Dummy;
