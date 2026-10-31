import React from "react";

import { EDITIONS_ENDPOINT } from "../shotgun/constants";
import { getCallApi } from "../utils/api/fetchMiddleware";
import { Callout, Loading } from "../ui";

// The scores board of the current edition, set from the editions tab of the admin interface
class ScoresPage extends React.Component {
    constructor() {
        super();

        this.state = { loading: true, scoresBoardUrl: null };
    }

    componentDidMount() {
        getCallApi(EDITIONS_ENDPOINT + "?current=true", true)
            .then((response) => response.json())
            .then((responseJson) =>
                this.setState({
                    loading: false,
                    scoresBoardUrl: (responseJson.data && responseJson.data.scoresBoardUrl) || null,
                }),
            )
            .catch(() => this.setState({ loading: false }));
    }

    renderBoard() {
        if (this.state.loading)
            return <Loading emoji="🏆">Chargement du tableau des scores...</Loading>;

        if (!this.state.scoresBoardUrl)
            return (
                <Callout kind="info" icon="⏳">
                    Le tableau des scores n'est pas encore disponible cette année. Reviens plus tard
                    !
                </Callout>
            );

        return (
            <div className="frame">
                <div className="frame__bar">
                    <span className="frame__dots" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                    </span>
                    <span className="frame__title">Tableau des scores</span>
                    <a href={this.state.scoresBoardUrl} target="_blank" rel="noreferrer">
                        Ouvrir en grand ↗
                    </a>
                </div>
                <iframe
                    className="frame__iframe frame__iframe--scores"
                    title="Tableau des scores"
                    src={this.state.scoresBoardUrl}
                />
            </div>
        );
    }

    render() {
        return (
            <div>
                <header className="page-header">
                    <span className="sticker sticker--yellow" style={{ "--tilt": "-3deg" }}>
                        En direct
                    </span>
                    <h1>
                        Scores{" "}
                        <span className="emoji" aria-hidden="true">
                            🏆
                        </span>
                    </h1>
                    <p>
                        Qui va repartir avec la gloire (et le cadeau) ? Suis le classement en
                        direct.
                    </p>
                </header>
                {this.renderBoard()}
            </div>
        );
    }
}

export default ScoresPage;
