import React from "react";

import {EDITIONS_ENDPOINT} from "./constants"
import {getParisDatetimeFromAPI} from "../utils/miscFcts";
import Countdown from "./components/CountDown"
import ShotgunController from "./ShotgunController"

import OnlyWhenConnectedWrapper from "../utils/login/OnlyWhenConnectedWrapper"
import {Icon, Message} from "semantic-ui-react";
import {getCallApi} from "../utils/api/fetchMiddleware";


class ShotgunPage extends React.Component {
    constructor() {
        super();

        this.state = {loading: true, currentDatetime: null};

        this.updateActualDate = this.updateActualDate.bind(this);
    }

    updateActualDate() {
        this.setState({loading: true}, () =>
            getParisDatetimeFromAPI()
                .then(jsonData => this.setState({
                    loading: false,
                    currentDatetime: new Date(jsonData.datetime)
                }))
        )
    }

    async componentDidMount() {
        this.setState({loading: true}, async () => {
            const editionsApiCall = await getCallApi(EDITIONS_ENDPOINT + "?current=true", true);
            const targetDatetime = (await editionsApiCall.json()).data.shotgunDate;
            const parisDatetimeFromApi = (await getParisDatetimeFromAPI()).datetime;

            this.setState({
                loading: false,
                currentDatetime: new Date(parisDatetimeFromApi),
                targetDatetime: new Date(targetDatetime)
            })
        });
    }

    render() {
        let display = this.state.loading ?
            <Message info icon>
                <Icon name="circle notched" loading/>
                <Message.Content>Vérification de l'heure...</Message.Content>
            </Message> :
            (this.state.currentDatetime < this.state.targetDatetime ?
                <div>
                    <div className="Countdown">Ouverture du Shotgun des chambres:</div>
                    <Countdown onTime={this.updateActualDate}
                               targetDatetime={this.state.targetDatetime}
                               currentDatetime={this.state.currentDatetime}/>
                </div>
                :
                <ShotgunController/>);

        return (<OnlyWhenConnectedWrapper>
            {display}
        </OnlyWhenConnectedWrapper>);
    }
}

export default ShotgunPage;
