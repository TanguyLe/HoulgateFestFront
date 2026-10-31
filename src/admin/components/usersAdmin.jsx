import React from "react";
import { Confirm, Loading, Notice, Spinner, Tag } from "../../ui";

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
    if (user.hasShotgun) return <Tag tone="ok">{user.room ? user.room.text : "Shotgun"}</Tag>;
    if (user.hasPreShotgun) return <Tag tone="warn">Pré-shotgun</Tag>;
    return "—";
};

const Toggle = ({ checked, disabled, onChange, label }) => (
    <label className="toggle" title={label}>
        <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
            aria-label={label}
        />
        <span />
    </label>
);

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

        if (loading) return <Loading>Chargement des utilisateurs...</Loading>;

        const shownUsers = this.getShownUsers();

        return (
            <div className="admin-section">
                <div className="admin-toolbar">
                    <input
                        className="input"
                        type="search"
                        placeholder="Nom ou email..."
                        aria-label="Rechercher un utilisateur"
                        value={search}
                        onChange={(event) => this.setState({ search: event.target.value })}
                    />
                    <select
                        className="input admin-select"
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
                    <span className="label">
                        {shownUsers.length} / {users.length} utilisateurs ·{" "}
                        {users.filter((user) => !user.activated).length} non activés
                    </span>
                </div>
                {error && (
                    <Notice type="error" onDismiss={() => this.setState({ error: "" })}>
                        {error}
                    </Notice>
                )}
                {success && (
                    <Notice type="success" onDismiss={() => this.setState({ success: "" })}>
                        {success}
                    </Notice>
                )}
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Email</th>
                                <th>Activé</th>
                                <th>Admin</th>
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
                                        className={user.activated ? "" : "row--danger"}
                                    >
                                        <td>
                                            {user.username} {isMe && <Tag tone="accent">toi</Tag>}
                                        </td>
                                        <td>{user.email}</td>
                                        <td className="nowrap">
                                            <Toggle
                                                checked={user.activated}
                                                disabled={disabled}
                                                label={"Compte activé : " + user.email}
                                                onChange={(checked) =>
                                                    this.update(user, { activated: checked })
                                                }
                                            />
                                            {!user.activated && (
                                                <button
                                                    type="button"
                                                    className="btn btn--small admin-mail"
                                                    title="Renvoyer l'email d'activation"
                                                    disabled={saving[user._id]}
                                                    onClick={() => this.sendActivationEmail(user)}
                                                >
                                                    {saving[user._id] ? <Spinner /> : "Renvoyer"}
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <Toggle
                                                checked={user.isAdmin}
                                                disabled={disabled}
                                                label={"Administrateur : " + user.email}
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
                    onCancel={() => this.setState({ adminChange: null })}
                    onConfirm={this.confirmAdminChange}
                />
            </div>
        );
    }
}

export default UsersAdmin;
