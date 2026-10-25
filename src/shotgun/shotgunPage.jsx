import React from "react";

import { EDITIONS_ENDPOINT } from "./constants";
import { getParisDatetimeFromAPI } from "../utils/miscFcts";
import Countdown from "./components/countdown";
import ShotgunController from "./components/shotgunController";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { Alert, PageHeader } from "../ui/components";
import Icon from "../ui/icon";

const formatShotgunDate = (date) => {
    const label = date.toLocaleString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
    });

    return label.charAt(0).toUpperCase() + label.slice(1);
};

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

    renderContent() {
        if (this.state.loading) return <Alert loading>Vérification de l'heure…</Alert>;

        // This is set within webpack
        if (process.env.HAS_STARTED) return <ShotgunController />;

        if (this.state.targetDatetime === null)
            return (
                <Alert title="Patience…">
                    La date de shotgun n'a pas encore été définie cette année. Reviens plus tard !
                </Alert>
            );

        if (this.state.currentDatetime < this.state.targetDatetime)
            return (
                <div className="countdown-card">
                    <div className="eyebrow">
                        <Icon name="clock" size={14} />
                        Ouverture du shotgun
                    </div>
                    <p className="countdown-card__date">
                        {formatShotgunDate(this.state.targetDatetime)}
                    </p>
                    <Countdown
                        onTime={this.updateActualDate}
                        targetDatetime={this.state.targetDatetime}
                        currentDatetime={this.state.currentDatetime}
                    />
                    <p className="countdown-card__hint">
                        Reste sur cette page : le plan de la villa s’affichera tout seul à l’heure
                        H. Connecte-toi bien avant, et prépare la liste de tes camarades de chambre.
                    </p>
                </div>
            );

        return <ShotgunController />;
    }

    render() {
        return (
            <div>
                <PageHeader eyebrow="Villa Les Genêts" title="Shotgun des chambres">
                    Clique sur une chambre libre pour la réserver, puis attribue les lits à tes
                    camarades. Premier arrivé, premier couché.
                </PageHeader>
                {this.renderContent()}
            </div>
        );
    }
}

export default ShotgunPage;
