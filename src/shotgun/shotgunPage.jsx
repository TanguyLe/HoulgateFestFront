import React from "react";

import { EDITIONS_ENDPOINT, PRESHOTGUN_TIMEOUT_MS } from "./constants";
import { getParisDatetimeFromAPI } from "../utils/miscFcts";
import Countdown from "./components/countdown";
import ShotgunController from "./components/shotgunController";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { Callout, Loading } from "../ui";
import { formatDateTime } from "../editions/phase";
import "./shotgun.css";

const ShotgunHeader = ({ children }) => (
    <header className="page-header shotgun-header">
        <span className="sticker sticker--yellow" style={{ "--tilt": "-3deg" }}>
            Villa Les Genêts
        </span>
        <h1>
            Shotgun des chambres{" "}
            <span className="emoji" aria-hidden="true">
                🛏️
            </span>
        </h1>
        {children}
    </header>
);

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
        if (this.state.loading) return <Loading emoji="⏰">Vérification de l'heure...</Loading>;

        // This is set within webpack
        if (process.env.HAS_STARTED) return <ShotgunController />;

        if (this.state.targetDatetime === null)
            return (
                <Callout kind="info" icon="🗓️">
                    La date de shotgun n'a pas encore été définie cette année. Reviens plus tard !
                </Callout>
            );

        if (this.state.currentDatetime < this.state.targetDatetime)
            return (
                <section className="card shotgun-wait">
                    <div className="shotgun-wait__emoji emoji" aria-hidden="true">
                        🏁
                    </div>
                    <h2 key="countdown-title" className="shotgun-wait__title">
                        Ouverture du Shotgun des chambres:
                    </h2>
                    <p className="muted">{formatDateTime(this.state.targetDatetime)}</p>
                    <Countdown
                        onTime={this.updateActualDate}
                        key="countdown-component"
                        label="Ouverture du shotgun dans"
                        targetDatetime={this.state.targetDatetime}
                        currentDatetime={this.state.currentDatetime}
                    />
                    <p className="small muted shotgun-wait__tip">
                        La page s'ouvrira toute seule à l'heure pile. Garde-la ouverte et que le
                        plus rapide gagne !
                    </p>
                </section>
            );

        return <ShotgunController />;
    }

    render() {
        return (
            <div className="shotgun-page">
                <ShotgunHeader>
                    <p>
                        Réserve ton lit, puis choisis qui dort avec toi. Une chambre pré-shotgun
                        doit être finalisée dans les {PRESHOTGUN_TIMEOUT_MS / 60000} minutes, sinon
                        elle est libérée !
                    </p>
                </ShotgunHeader>
                {this.renderContent()}
            </div>
        );
    }
}

export default ShotgunPage;
