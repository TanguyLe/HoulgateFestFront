import React from "react";

import EditionsAdmin from "./components/editionsAdmin";
import UsersAdmin from "./components/usersAdmin";
import ShotgunsAdmin from "./components/shotgunsAdmin";
import { getMe } from "./adminApi";
import { Alert, PageHeader, Tabs } from "../ui/components";

const TABS = [
    { key: "editions", icon: "calendar", label: "Éditions" },
    { key: "users", icon: "users", label: "Utilisateurs" },
    { key: "shotguns", icon: "bed", label: "Shotguns" },
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

    renderTab() {
        if (this.state.tab === "users") return <UsersAdmin me={this.state.me} />;
        if (this.state.tab === "shotguns") return <ShotgunsAdmin />;
        return <EditionsAdmin />;
    }

    render() {
        if (this.state.loading) return <Alert loading>Vérification des droits…</Alert>;

        if (this.state.error) return <Alert tone="error">{this.state.error}</Alert>;

        // The back checks the rights on every admin call, this only avoids showing a useless page
        if (!this.state.me.isAdmin)
            return (
                <Alert tone="warning" title="Accès réservé">
                    Cette page est réservée aux administrateurs.
                </Alert>
            );

        return (
            <>
                <PageHeader eyebrow="Coulisses" title="Administration" />
                <Tabs
                    tabs={TABS}
                    active={this.state.tab}
                    label="Sections de l'administration"
                    onChange={(tab) => this.setState({ tab: tab })}
                >
                    {this.renderTab()}
                </Tabs>
            </>
        );
    }
}

export default AdminPage;
