import React from "react";

import EditionsAdmin from "./components/editionsAdmin";
import UsersAdmin from "./components/usersAdmin";
import ShotgunsAdmin from "./components/shotgunsAdmin";
import { getMe } from "./adminApi";
import { Loading, Notice, PageHead } from "../ui";

const TABS = [
    { key: "editions", label: "Éditions" },
    { key: "users", label: "Utilisateurs" },
    { key: "shotguns", label: "Shotguns" },
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

    onTabKeyDown(event, index) {
        const next =
            event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : null;
        if (next === null) return;

        const tab = TABS[(next + TABS.length) % TABS.length];
        this.setState({ tab: tab.key }, () => document.getElementById("tab-" + tab.key).focus());
    }

    renderPanel() {
        switch (this.state.tab) {
            case "users":
                return <UsersAdmin me={this.state.me} />;
            case "shotguns":
                return <ShotgunsAdmin />;
            default:
                return <EditionsAdmin />;
        }
    }

    render() {
        if (this.state.loading) return <Loading>Vérification des droits...</Loading>;

        if (this.state.error) return <Notice type="error">{this.state.error}</Notice>;

        // The back checks the rights on every admin call, this only avoids showing a useless page
        if (!this.state.me.isAdmin)
            return (
                <Notice type="warning" title="Accès réservé">
                    Cette page est réservée aux administrateurs.
                </Notice>
            );

        return (
            <div className="admin">
                <PageHead kicker="Coulisses" title="Administration" />
                <div className="tabs" role="tablist" aria-label="Administration">
                    {TABS.map((tab, index) => (
                        <button
                            key={tab.key}
                            id={"tab-" + tab.key}
                            type="button"
                            role="tab"
                            className="tabs__tab"
                            aria-selected={this.state.tab === tab.key}
                            aria-controls="admin-panel"
                            tabIndex={this.state.tab === tab.key ? 0 : -1}
                            onClick={() => this.setState({ tab: tab.key })}
                            onKeyDown={(event) => this.onTabKeyDown(event, index)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div
                    className="tabs__panel"
                    id="admin-panel"
                    role="tabpanel"
                    aria-labelledby={"tab-" + this.state.tab}
                >
                    {this.renderPanel()}
                </div>
            </div>
        );
    }
}

export default AdminPage;
