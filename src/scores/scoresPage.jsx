import React from "react";

import { Alert, PageHeader } from "../ui/components";
import { EDITIONS_ENDPOINT } from "../shotgun/constants";
import { getCallApi } from "../utils/api/fetchMiddleware";

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
        if (this.state.loading) return <Alert loading>Chargement du tableau des scores…</Alert>;

        if (!this.state.scoresBoardUrl)
            return (
                <Alert>
                    Le tableau des scores n’est pas encore disponible cette année. Reviens plus
                    tard !
                </Alert>
            );

        return (
            <div className="embed">
                <iframe title="Tableau des scores" src={this.state.scoresBoardUrl} />
            </div>
        );
    }

    render() {
        return (
            <div>
                <PageHeader title="Tableau des scores">
                    Le classement des duos, mis à jour tout au long du week-end.
                </PageHeader>
                {this.renderBoard()}
            </div>
        );
    }
}

export default ScoresPage;
