import React from "react";

import { EDITIONS_ENDPOINT } from "./constants";
import { getParisDatetimeFromAPI } from "../utils/miscFcts";
import Countdown from "./components/countdown";
import ShotgunController from "./components/shotgunController";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { currentEdition } from "../content/currentEdition";
import { Button, Card, Loading, Notice } from "../ui";
import "./shotgun.css";

const Header = () => (
    <header className="page-header">
        <h1 className="headline-large">Shotgun</h1>
        <p className="body-large on-surface-variant">
            Choisis ta chambre, puis qui dort avec toi : tu as 2 minutes pour confirmer. Seul ton
            lit est à réserver sur ce site.
        </p>
    </header>
);

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/Paris",
});

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
        if (this.state.loading) return <Loading>Vérification de l'heure…</Loading>;

        const started = (
            <>
                <Header />
                <ShotgunController />
            </>
        );

        // This is set within webpack
        if (process.env.HAS_STARTED) return started;

        if (!this.state.targetDatetime)
            return (
                <>
                    <Header />
                    <Notice title="Pas encore de date">
                        La date de shotgun n'a pas encore été définie cette année. Reviens plus tard
                        !
                    </Notice>
                </>
            );

        if (this.state.currentDatetime >= this.state.targetDatetime) return started;

        return (
            <>
                <Header />
                <Card className="countdown-card">
                    <h2 className="title-large">
                        Ouverture du shotgun le {DATE_FORMAT.format(this.state.targetDatetime)}
                    </h2>
                    <Countdown
                        onTime={this.updateActualDate}
                        targetDatetime={this.state.targetDatetime}
                        currentDatetime={this.state.currentDatetime}
                    />
                    <p className="body-medium on-surface-variant">
                        D'ici là, vérifie que tu arrives à te connecter et lis le guide : le jour J,
                        tout se joue en quelques secondes.
                    </p>
                    <div>
                        <Button
                            variant="tonal"
                            icon="menuBook"
                            href={currentEdition.shotgunGuideUrl}
                        >
                            Le guide du shotgun
                        </Button>
                    </div>
                </Card>
            </>
        );
    }
}

export default ShotgunPage;
