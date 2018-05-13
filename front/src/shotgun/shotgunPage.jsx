import React from "react";

import {shotgunDate} from "./constants"
import Countdown from "./components/CountDown"
import ShotgunController from "./ShotgunController"

import OnlyWhenConnectedWrapper from "../utils/login/OnlyWhenConnectedWrapper"


class ShotgunPage extends React.Component {
    constructor(){
        super();

        this.forceUpdate = this.forceUpdate.bind(this);
    }
	render() {
        let display = Date.now() < Date.parse(shotgunDate) ?
            <div>
                <div className="Countdown">Ouverture du Shotgun des chambres: </div>
                <Countdown onTime={this.forceUpdate} date={shotgunDate}/>
            </div>
            :
            <ShotgunController/>;

		return(<OnlyWhenConnectedWrapper>
                {display}
                </OnlyWhenConnectedWrapper>);
	}
}

export default ShotgunPage;
