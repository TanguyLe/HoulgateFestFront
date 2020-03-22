import React from "react";

import {shotgunDate} from "./constants"
import {getParisDatetimeFromAPI} from "../utils/miscFcts";
import Countdown from "./components/CountDown"
import ShotgunController from "./ShotgunController"

import OnlyWhenConnectedWrapper from "../utils/login/OnlyWhenConnectedWrapper"
import {Icon, Message} from "semantic-ui-react";


class ShotgunPage extends React.Component {
    constructor() {
        super();

        this.state = {loading: true, timezoneLocalizedActualDatetime: null};

        this.updateActualDate = this.updateActualDate.bind(this);
    }

    updateActualDate() {
        this.setState({loading: true}, () =>
            getParisDatetimeFromAPI()
                .then(jsonData => this.setState({loading: false, timezoneLocalizedActualDatetime: jsonData.datetime}))
        )
    }

    componentDidMount() {
        this.updateActualDate()
    }

    render() {
        let display = this.state.loading ?
            <Message info icon>
                <Icon name="circle notched" loading/>
                <Message.Content>Vérification de l'heure...</Message.Content>
            </Message> :
            (Date.parse(this.state.timezoneLocalizedActualDatetime) < Date.parse(shotgunDate) ?
                <div>
                    <div className="Countdown">Ouverture du Shotgun des chambres:</div>
                    <Countdown onTime={this.updateActualDate}
                               targetDatetime={shotgunDate}
                               timezoneLocalizedActualDatetime={this.state.timezoneLocalizedActualDatetime}/>
                </div>
                :
                <ShotgunController/>);

        return (<OnlyWhenConnectedWrapper>
            {display}
        </OnlyWhenConnectedWrapper>);
    }
}

export default ShotgunPage;
