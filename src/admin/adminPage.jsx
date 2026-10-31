import React from "react";

import EditionsAdmin from "./components/editionsAdmin";
import UsersAdmin from "./components/usersAdmin";
import ShotgunsAdmin from "./components/shotgunsAdmin";
import { getMe } from "./adminApi";
import { Loading, Notice, Tabs } from "../ui";
import "./admin.css";

const TABS = [
    { key: "editions", label: "Éditions", icon: "event" },
    { key: "users", label: "Utilisateurs", icon: "group" },
    { key: "shotguns", label: "Shotguns", icon: "bed" },
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
        if (this.state.loading) return <Loading>Vérification des droits…</Loading>;

        if (this.state.error) return <Notice tone="error">{this.state.error}</Notice>;

        // The back checks the rights on every admin call, this only avoids showing a useless page
        if (!this.state.me.isAdmin)
            return (
                <Notice tone="warning" title="Accès réservé">
                    Cette page est réservée aux administrateurs.
                </Notice>
            );

        const { tab } = this.state;

        return (
            <>
                <header className="page-header">
                    <h1 className="headline-large">Administration</h1>
                </header>
                <Tabs
                    tabs={TABS}
                    selected={tab}
                    onSelect={(key) => this.setState({ tab: key })}
                    label="Sections de l'administration"
                >
                    {tab === "editions" && <EditionsAdmin />}
                    {tab === "users" && <UsersAdmin me={this.state.me} />}
                    {tab === "shotguns" && <ShotgunsAdmin />}
                </Tabs>
            </>
        );
    }
}

export default AdminPage;
