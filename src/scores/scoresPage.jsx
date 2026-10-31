import React from "react";

import { EDITIONS_ENDPOINT } from "../shotgun/constants";
import { getCallApi } from "../utils/api/fetchMiddleware";
import { Loading, Notice, PageHead } from "../ui";

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
        if (this.state.loading) return <Loading>Chargement du tableau des scores...</Loading>;

        if (!this.state.scoresBoardUrl)
            return (
                <Notice type="info">
                    Le tableau des scores n'est pas encore disponible cette année. Reviens plus tard
                    !
                </Notice>
            );

        return (
            <div className="frame frame--scores">
                <div className="frame__bar">
                    <span className="label">
                        <span className="live-dot" aria-hidden="true" /> En direct
                    </span>
                    <a
                        className="label"
                        href={this.state.scoresBoardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Plein écran ↗
                    </a>
                </div>
                <iframe title="Tableau des scores" src={this.state.scoresBoardUrl} />
            </div>
        );
    }

    render() {
        return (
            <div>
                <PageHead
                    kicker="Tableau des scores"
                    title="Scores"
                    marquee={["Qui va gagner", "Scores", "Qui va gagner", "Scores"]}
                />
                {this.renderBoard()}
            </div>
        );
    }
}

export default ScoresPage;
