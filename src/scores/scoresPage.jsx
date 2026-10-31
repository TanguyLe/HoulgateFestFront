import React from "react";
import { Loading, Notice, PageHeader } from "../ui";

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

    render() {
        let content;
        if (this.state.loading) content = <Loading>Chargement du tableau des scores...</Loading>;
        else if (!this.state.scoresBoardUrl)
            content = (
                <Notice kind="info">
                    Le tableau des scores n'est pas encore disponible cette année. Reviens plus tard
                    !
                </Notice>
            );
        else
            content = (
                <div className="frame">
                    <iframe
                        title="Tableau des scores"
                        className="frame__iframe frame__iframe--scores"
                        src={this.state.scoresBoardUrl}
                    />
                </div>
            );

        return (
            <div className="scores-page">
                <PageHeader kicker="En direct de la villa" title="Tableau des scores" />
                {content}
            </div>
        );
    }
}

export default ScoresPage;
