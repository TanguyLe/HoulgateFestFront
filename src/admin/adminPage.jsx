import React from "react";

import "./admin.css";
import EditionsAdmin from "./components/editionsAdmin";
import UsersAdmin from "./components/usersAdmin";
import ShotgunsAdmin from "./components/shotgunsAdmin";
import { getMe } from "./adminApi";
import { Callout, Loading, Tabs } from "../ui";

const TABS = [
    { key: "editions", emoji: "📅", label: "Éditions" },
    { key: "users", emoji: "👥", label: "Utilisateurs" },
    { key: "shotguns", emoji: "🛏️", label: "Shotguns" },
];

class AdminPage extends React.Component {
    constructor() {
        super();

        this.state = { loading: true, me: null, error: "", tab: "editions" };
    }

    componentDidMount() {
        getMe()
            .then((me) => this.setState({ loading: false, me: me }))
            .catch((error) => this.setState({ loading: false, error: error.message }));
    }

    render() {
        if (this.state.loading) return <Loading emoji="⚙️">Vérification des droits...</Loading>;

        if (this.state.error) return <Callout kind="error">{this.state.error}</Callout>;

        // The back checks the rights on every admin call, this only avoids showing a useless page
        if (!this.state.me.isAdmin)
            return (
                <Callout kind="warning" icon="🚧" title="Accès réservé">
                    Cette page est réservée aux administrateurs.
                </Callout>
            );

        const { tab } = this.state;

        return (
            <div className="admin">
                <header className="page-header">
                    <h1>
                        <span className="emoji" aria-hidden="true">
                            ⚙️
                        </span>
                        Administration
                    </h1>
                </header>
                <Tabs
                    tabs={TABS}
                    active={tab}
                    onChange={(key) => this.setState({ tab: key })}
                    label="Sections de l'administration"
                />
                <div className="admin__pane" role="tabpanel">
                    {tab === "editions" && <EditionsAdmin />}
                    {tab === "users" && <UsersAdmin me={this.state.me} />}
                    {tab === "shotguns" && <ShotgunsAdmin />}
                </div>
            </div>
        );
    }
}

export default AdminPage;
