import React from "react";

import { EDITIONS_ENDPOINT } from "./constants";
import { getParisDatetimeFromAPI } from "../utils/miscFcts";
import Countdown from "./components/countdown";
import ShotgunController from "./components/shotgunController";

import { Loading, Notice, PageHeader } from "../ui";
import { getCallApi } from "../utils/api/fetchMiddleware";

class ShotgunPage extends React.Component {
    constructor() {
        super();

        this.state = { loading: true, currentDatetime: null };

        this.updateActualDate = this.updateActualDate.bind(this);
    }

    updateActualDate() {
        this.setState({ loading: true }, () =>
            getParisDatetimeFromAPI().then((date) =>
                this.setState({
                    loading: false,
                    currentDatetime: date,
                }),
            ),
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
                const parisDatetimeFromApi = await getParisDatetimeFromAPI();

                this.setState({
                    loading: false,
                    currentDatetime: new Date(parisDatetimeFromApi),
                    targetDatetime: new Date(targetDatetime),
                });
            }
        });
    }

    render() {
        if (this.state.loading) return <Loading>Vérification de l'heure...</Loading>;

        // This is set within webpack
        if (process.env.HAS_STARTED) return <ShotgunController />;

        if (this.state.targetDatetime === null)
            return (
                <>
                    <PageHeader kicker="Villa Les Genêts" title="Shotgun des chambres" />
                    <Notice kind="info">
                        La date de shotgun n'a pas encore été définie cette année. Reviens plus tard
                        !
                    </Notice>
                </>
            );

        if (this.state.currentDatetime < this.state.targetDatetime)
            return (
                <section className="shotgun-wait card card--striped">
                    <span className="kicker">Villa Les Genêts · Shotgun</span>
                    <h1 className="shotgun-wait__title">Ouverture du Shotgun des chambres</h1>
                    <p className="shotgun-wait__date">
                        {this.state.targetDatetime.toLocaleString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <Countdown
                        onTime={this.updateActualDate}
                        key="countdown-component"
                        size="xl"
                        targetDatetime={this.state.targetDatetime}
                        currentDatetime={this.state.currentDatetime}
                    />
                    <p className="muted small">
                        Garde cette page ouverte : les chambres apparaîtront d’elles-mêmes à l’heure
                        pile.
                    </p>
                </section>
            );

        return <ShotgunController />;
    }
}

export default ShotgunPage;
