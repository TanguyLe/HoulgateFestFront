import React from "react";
import { Callout, Confirm, Loading, Spinner, Switch } from "../../ui";

import { ADMIN_USERS_URL, getAdminUserUrl, getAdminActivationEmailUrl } from "../constants";
import { adminGet, adminPost, adminPut } from "../adminApi";

const FILTERS = {
    all: { text: "Tous", test: () => true },
    activated: { text: "Activés", test: (user) => user.activated },
    notActivated: { text: "Non activés", test: (user) => !user.activated },
    admins: { text: "Admins", test: (user) => user.isAdmin },
    shotgun: { text: "Avec un shotgun", test: (user) => user.hasShotgun || user.hasPreShotgun },
};
const FILTER_OPTIONS = Object.keys(FILTERS).map((key) => ({
    key: key,
    value: key,
    text: FILTERS[key].text,
}));

const shotgunCell = (user) => {
    if (user.hasShotgun)
        return <span className="chip chip--free">{user.room ? user.room.text : "Shotgun"}</span>;
    if (user.hasPreShotgun) return <span className="chip chip--pending">Pré-shotgun</span>;
    return "—";
};

class UsersAdmin extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            users: [],
            search: "",
            filter: "all",
            saving: {},
            error: "",
            success: "",
            adminChange: null,
        };

        this.update = this.update.bind(this);
        this.confirmAdminChange = this.confirmAdminChange.bind(this);
        this.sendActivationEmail = this.sendActivationEmail.bind(this);
    }

    componentDidMount() {
        adminGet(ADMIN_USERS_URL)
            .then((users) => this.setState({ loading: false, users: users }))
            .catch((error) => this.setState({ loading: false, error: error.message }));
    }

    setSaving(userId, saving) {
        this.setState({ saving: Object.assign({}, this.state.saving, { [userId]: saving }) });
    }

    update(user, change) {
        this.setSaving(user._id, true);
        adminPut(getAdminUserUrl(user._id), change)
            .then((updated) =>
                this.setState({
                    users: this.state.users.map((u) => (u._id === updated._id ? updated : u)),
                    error: "",
                }),
            )
            .catch((error) => this.setState({ error: error.message }))
            .finally(() => this.setSaving(user._id, false));
    }

    sendActivationEmail(user) {
        this.setSaving(user._id, true);
        adminPost(getAdminActivationEmailUrl(user._id))
            .then(() =>
                this.setState({
                    error: "",
                    success: "Email d'activation renvoyé à " + user.email + ".",
                }),
            )
            .catch((error) => this.setState({ error: error.message, success: "" }))
            .finally(() => this.setSaving(user._id, false));
    }

    confirmAdminChange() {
        const { user, isAdmin } = this.state.adminChange;
        this.setState({ adminChange: null });
        this.update(user, { isAdmin: isAdmin });
    }

    getShownUsers() {
        const search = this.state.search.trim().toLowerCase();

        return this.state.users.filter(
            (user) =>
                FILTERS[this.state.filter].test(user) &&
                (!search ||
                    (user.username || "").toLowerCase().includes(search) ||
                    user.email.toLowerCase().includes(search)),
        );
    }

    render() {
        const { loading, users, search, filter, saving, error, success, adminChange } = this.state;
        const { me } = this.props;

        if (loading) return <Loading emoji="👥">Chargement des utilisateurs...</Loading>;

        const shownUsers = this.getShownUsers();

        return (
            <div className="stack">
                <div className="row">
                    <input
                        type="search"
                        className="input admin__search"
                        placeholder="🔍 Nom ou email..."
                        aria-label="Chercher un utilisateur"
                        value={search}
                        onChange={(event) => this.setState({ search: event.target.value })}
                    />
                    <select
                        className="select admin__select"
                        aria-label="Filtre"
                        value={filter}
                        onChange={(event) => this.setState({ filter: event.target.value })}
                    >
                        {FILTER_OPTIONS.map((option) => (
                            <option key={option.key} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                    <span className="small muted">
                        {shownUsers.length} / {users.length} utilisateurs ·{" "}
                        {users.filter((user) => !user.activated).length} non activés
                    </span>
                </div>
                {error && (
                    <Callout kind="error" onDismiss={() => this.setState({ error: "" })}>
                        {error}
                    </Callout>
                )}
                {success && (
                    <Callout kind="success" onDismiss={() => this.setState({ success: "" })}>
                        {success}
                    </Callout>
                )}
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Email</th>
                                <th className="collapsing">Activé</th>
                                <th className="collapsing">Admin</th>
                                <th>Shotgun</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shownUsers.map((user) => {
                                // The back refuses it too: an admin can't lock themselves out
                                const isMe = user.email === me.email;
                                const disabled = isMe || saving[user._id];

                                return (
                                    <tr
                                        key={user._id}
                                        className={user.activated ? "" : "is-negative"}
                                    >
                                        <td>
                                            {user.username}
                                            {isMe && (
                                                <span className="chip chip--plain admin__tag">
                                                    toi
                                                </span>
                                            )}
                                        </td>
                                        <td>{user.email}</td>
                                        <td className="nowrap">
                                            <div className="row admin__actions">
                                                <Switch
                                                    label={"Compte de " + user.username + " activé"}
                                                    checked={user.activated}
                                                    disabled={disabled}
                                                    onChange={(checked) =>
                                                        this.update(user, { activated: checked })
                                                    }
                                                />
                                                {!user.activated && (
                                                    <button
                                                        type="button"
                                                        className="btn btn--sm btn--icon"
                                                        title="Renvoyer l'email d'activation"
                                                        aria-label="Renvoyer l'email d'activation"
                                                        disabled={saving[user._id]}
                                                        onClick={() =>
                                                            this.sendActivationEmail(user)
                                                        }
                                                    >
                                                        {saving[user._id] ? <Spinner /> : "✉️"}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="nowrap">
                                            <Switch
                                                label={user.username + " administrateur"}
                                                checked={user.isAdmin}
                                                disabled={disabled}
                                                onChange={(checked) =>
                                                    this.setState({
                                                        adminChange: {
                                                            user: user,
                                                            isAdmin: checked,
                                                        },
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>{shotgunCell(user)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Confirm
                    open={adminChange !== null}
                    header={
                        adminChange
                            ? (adminChange.isAdmin ? "Donner" : "Retirer") +
                              " les droits d'admin à " +
                              adminChange.user.username +
                              " ?"
                            : ""
                    }
                    content={
                        adminChange && adminChange.isAdmin
                            ? "Un admin peut modifier les éditions et les utilisateurs."
                            : "Cet utilisateur n'aura plus accès à l'administration."
                    }
                    confirmLabel="Confirmer"
                    onCancel={() => this.setState({ adminChange: null })}
                    onConfirm={this.confirmAdminChange}
                />
            </div>
        );
    }
}

export default UsersAdmin;
