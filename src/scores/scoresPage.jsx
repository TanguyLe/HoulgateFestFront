import React from "react";
import { Icon, Message } from "semantic-ui-react";

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
        if (this.state.loading)
            return (
                <Message info icon>
                    <Icon name="circle notched" loading />
                    <Message.Content>Chargement du tableau des scores...</Message.Content>
                </Message>
            );

        if (!this.state.scoresBoardUrl)
            return (
                <Message info>
                    <Message.Content>
                        Le tableau des scores n'est pas encore disponible cette année. Reviens plus
                        tard !
                    </Message.Content>
                </Message>
            );

        return (
            <iframe
                style={{ height: "900px", width: "100%", border: "none" }}
                src={this.state.scoresBoardUrl}
            />
        );
    }
}

export default ScoresPage;
