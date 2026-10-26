import React from "react";
import { Header, Icon, Message, Tab } from "semantic-ui-react";

import EditionsAdmin from "./components/editionsAdmin";
import UsersAdmin from "./components/usersAdmin";
import ShotgunsAdmin from "./components/shotgunsAdmin";
import { getMe } from "./adminApi";

class AdminPage extends React.Component {
    constructor() {
        super();

        this.state = { loading: true, me: null, error: "" };
    }

    componentDidMount() {
        getMe()
            .then((me) => this.setState({ loading: false, me: me }))
            .catch((error) => this.setState({ loading: false, error: error.message }));
    }

    render() {
        if (this.state.loading)
            return (
                <Message info icon>
                    <Icon name="circle notched" loading />
                    <Message.Content>Vérification des droits...</Message.Content>
                </Message>
            );

        if (this.state.error) return <Message error content={this.state.error} />;

        // The back checks the rights on every admin call, this only avoids showing a useless page
        if (!this.state.me.isAdmin)
            return (
                <Message warning>
                    <Message.Header>Accès réservé</Message.Header>
                    Cette page est réservée aux administrateurs.
                </Message>
            );

        const panes = [
            {
                menuItem: { key: "editions", icon: "calendar", content: "Éditions" },
                render: () => (
                    <Tab.Pane>
                        <EditionsAdmin />
                    </Tab.Pane>
                ),
            },
            {
                menuItem: { key: "users", icon: "users", content: "Utilisateurs" },
                render: () => (
                    <Tab.Pane>
                        <UsersAdmin me={this.state.me} />
                    </Tab.Pane>
                ),
            },
            {
                menuItem: { key: "shotguns", icon: "bed", content: "Shotguns" },
                render: () => (
                    <Tab.Pane>
                        <ShotgunsAdmin />
                    </Tab.Pane>
                ),
            },
        ];

        return (
            <div>
                <Header as="h1">
                    <Icon name="settings" />
                    <Header.Content>Administration</Header.Content>
                </Header>
                <Tab panes={panes} />
            </div>
        );
    }
}

export default AdminPage;
