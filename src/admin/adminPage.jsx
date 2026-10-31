import React from "react";

import EditionsAdmin from "./components/editionsAdmin";
import UsersAdmin from "./components/usersAdmin";
import ShotgunsAdmin from "./components/shotgunsAdmin";
import { getMe } from "./adminApi";
import { Icon, Loading, Notice, PageHeader } from "../ui";

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

    render() {
        if (this.state.loading) return <Loading>Vérification des droits...</Loading>;

        if (this.state.error) return <Notice kind="error">{this.state.error}</Notice>;

        // The back checks the rights on every admin call, this only avoids showing a useless page
        if (!this.state.me.isAdmin)
            return (
                <Notice kind="warning" title="Accès réservé">
                    Cette page est réservée aux administrateurs.
                </Notice>
            );

        const { tab } = this.state;

        return (
            <div className="admin">
                <PageHeader kicker="Capitainerie" title="Administration" />
                <div className="tabs" role="tablist" aria-label="Administration">
                    {TABS.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            role="tab"
                            id={"tab-" + item.key}
                            aria-selected={tab === item.key}
                            aria-controls={"panel-" + item.key}
                            className="tabs__tab"
                            onClick={() => this.setState({ tab: item.key })}
                        >
                            <Icon name={item.icon} size={18} />
                            {item.label}
                        </button>
                    ))}
                </div>
                <div role="tabpanel" id={"panel-" + tab} aria-labelledby={"tab-" + tab}>
                    {tab === "editions" && <EditionsAdmin />}
                    {tab === "users" && <UsersAdmin me={this.state.me} />}
                    {tab === "shotguns" && <ShotgunsAdmin />}
                </div>
            </div>
        );
    }
}

export default AdminPage;
