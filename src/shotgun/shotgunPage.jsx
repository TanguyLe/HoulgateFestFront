import React from "react";

import { EDITIONS_ENDPOINT } from "./constants";
import { getParisDatetimeFromAPI } from "../utils/miscFcts";
import Countdown from "./components/countdown";
import ShotgunController from "./components/shotgunController";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { Loading, Notice, PageHead } from "../ui";
import { formatDay, formatHour } from "../editions/phase";

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
                    <PageHead kicker="Villa Les Genêts" title="Shotgun" />
                    <Notice type="info">
                        La date de shotgun n'a pas encore été définie cette année. Reviens plus tard
                        !
                    </Notice>
                </>
            );

        if (this.state.currentDatetime < this.state.targetDatetime)
            return (
                <>
                    <PageHead kicker="Ouverture du Shotgun des chambres" title="Pas encore !">
                        Rendez-vous le {formatDay(this.state.targetDatetime)} à{" "}
                        {formatHour(this.state.targetDatetime)}, la page s'ouvrira toute seule.
                    </PageHead>
                    <Countdown
                        onTime={this.updateActualDate}
                        targetDatetime={this.state.targetDatetime}
                        currentDatetime={this.state.currentDatetime}
                        label="Temps avant l'ouverture du shotgun"
                    />
                </>
            );

        return <ShotgunController />;
    }
}

export default ShotgunPage;
