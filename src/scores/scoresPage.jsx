import React from "react";

import { EDITIONS_ENDPOINT } from "../shotgun/constants";
import { getCallApi } from "../utils/api/fetchMiddleware";
import { Card, Loading, Notice } from "../ui";
import "../trip/trip.css";

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

    render() {
        let content;
        if (this.state.loading) content = <Loading>Chargement du tableau des scores…</Loading>;
        else if (!this.state.scoresBoardUrl)
            content = (
                <Notice>
                    Le tableau des scores n'est pas encore disponible cette année. Reviens plus tard
                    !
                </Notice>
            );
        else
            content = (
                <Card variant="outlined" className="scores-card">
                    <iframe
                        title="Le tableau des scores"
                        className="scores-card__frame"
                        src={this.state.scoresBoardUrl}
                    />
                </Card>
            );

        return (
            <>
                <header className="page-header">
                    <h1 className="headline-large">Scores</h1>
                </header>
                {content}
            </>
        );
    }
}

export default ScoresPage;
