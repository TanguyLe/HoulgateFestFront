import React from "react";

import { EDITIONS_ENDPOINT } from "./constants";
import { getParisDatetimeFromAPI } from "../utils/miscFcts";
import Countdown from "./components/countdown";
import ShotgunController from "./components/shotgunController";

import { Icon, Message } from "semantic-ui-react";
import { getCallApi } from "../utils/api/fetchMiddleware";

class ShotgunPage extends React.Component {
    constructor() {
        super();

        this.state = { loading: true, currentDatetime: null };

        this.updateActualDate = this.updateActualDate.bind(this);
    }

    updateActualDate() {
        this.setState({ loading: true }, () =>
            getParisDatetimeFromAPI().then((jsonData) =>
                this.setState({
                    loading: false,
                    currentDatetime: new Date(jsonData.datetime),
                })
            )
        );
    }

    async componentDidMount() {
        this.setState({ loading: true }, async () => {
            const editionsApiCall = await getCallApi(EDITIONS_ENDPOINT + "?current=true", true);
            const responseJson = await editionsApiCall.json();
            if (responseJson.data === undefined)
                this.setState({
                    loading: false,
                    targetDatetime: null,
                });
            else {
                const targetDatetime = responseJson.data.shotgunDate;
                const parisDatetimeFromApi = (await getParisDatetimeFromAPI()).datetime;

                this.setState({
                    loading: false,
                    currentDatetime: new Date(parisDatetimeFromApi),
                    targetDatetime: new Date(targetDatetime),
                });
            }
        });
    }

    render() {
        if (this.state.loading)
            return (
                <Message info icon>
                    <Icon name="circle notched" loading />
                    <Message.Content>Vérification de l'heure...</Message.Content>
                </Message>
            );

        // This is set within webpack
        if (process.env.HAS_STARTED) return <ShotgunController />;

        if (this.state.targetDatetime === null)
            return (
                <Message info>
                    <Message.Content>
                        La date de shotgun n'a pas encore été définie cette année. Reviens plus tard
                        !
                    </Message.Content>
                </Message>
            );

        if (this.state.currentDatetime < this.state.targetDatetime)
            return [
                <div key="countdown-title" className="Countdown">
                    Ouverture du Shotgun des chambres:
                </div>,
                <Countdown
                    onTime={this.updateActualDate}
                    key="countdown-component"
                    targetDatetime={this.state.targetDatetime}
                    currentDatetime={this.state.currentDatetime}
                />,
            ];

        return <ShotgunController />;
    }
}

export default ShotgunPage;
