import React from "react";

import Icon from "../../ui/icon";
import { Alert, ConfirmDialog, Switch } from "../../ui/components";
import { notify } from "../../ui/toast";
import { ADMIN_USERS_URL, getAdminUserUrl, getAdminActivationEmailUrl } from "../constants";
import { adminGet, adminPost, adminPut } from "../adminApi";

const FILTERS = {
    all: { text: "Tous", test: () => true },
    activated: { text: "Activés", test: (user) => user.activated },
    notActivated: { text: "Non activés", test: (user) => !user.activated },
    admins: { text: "Admins", test: (user) => user.isAdmin },
    shotgun: { text: "Avec un shotgun", test: (user) => user.hasShotgun || user.hasPreShotgun },
};

const shotgunCell = (user) => {
    if (user.hasShotgun)
        return (
            <span className="chip chip--sm chip--success">
                {user.room ? user.room.text : "Shotgun"}
            </span>
        );
    if (user.hasPreShotgun) return <span className="chip chip--sm chip--warning">Pré-shotgun</span>;
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
                }),
            )
            .catch((error) => notify.error(error.message))
            .finally(() => this.setSaving(user._id, false));
    }

    sendActivationEmail(user) {
        this.setSaving(user._id, true);
        adminPost(getAdminActivationEmailUrl(user._id))
            .then(() => notify.success("Email d'activation renvoyé à " + user.email + "."))
            .catch((error) => notify.error(error.message))
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
        const { loading, users, search, filter, saving, error, adminChange } = this.state;
        const { me } = this.props;

        if (loading) return <Alert loading>Chargement des utilisateurs…</Alert>;

        if (error) return <Alert tone="error">{error}</Alert>;

        const shownUsers = this.getShownUsers();

        return (
            <div className="admin-stack">
                <div className="admin-toolbar">
                    <input
                        className="field__control"
                        type="search"
                        placeholder="Nom ou email…"
                        aria-label="Rechercher un utilisateur"
                        value={search}
                        onChange={(event) => this.setState({ search: event.target.value })}
                    />
                    <select
                        className="field__control"
                        aria-label="Filtrer les utilisateurs"
                        value={filter}
                        onChange={(event) => this.setState({ filter: event.target.value })}
                    >
                        {Object.keys(FILTERS).map((key) => (
                            <option key={key} value={key}>
                                {FILTERS[key].text}
                            </option>
                        ))}
                    </select>
                    <span className="admin-toolbar__count">
                        {shownUsers.length} / {users.length} utilisateurs ·{" "}
                        {users.filter((user) => !user.activated).length} non activés
                    </span>
                </div>
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Utilisateur</th>
                                <th scope="col">Email</th>
                                <th scope="col">Activé</th>
                                <th scope="col">Admin</th>
                                <th scope="col">Shotgun</th>
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
                                        data-tone={!user.activated ? "danger" : undefined}
                                    >
                                        <td>
                                            {user.username}{" "}
                                            {isMe && <span className="chip chip--sm">toi</span>}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <div className="admin-toolbar">
                                                <Switch
                                                    checked={user.activated}
                                                    disabled={disabled}
                                                    label={"Compte de " + user.username + " activé"}
                                                    onChange={(checked) =>
                                                        this.update(user, { activated: checked })
                                                    }
                                                />
                                                {!user.activated && (
                                                    <button
                                                        type="button"
                                                        className="btn btn--ghost btn--icon btn--sm"
                                                        title="Renvoyer l'email d'activation"
                                                        aria-label={
                                                            "Renvoyer l'email d'activation à " +
                                                            user.username
                                                        }
                                                        disabled={saving[user._id]}
                                                        onClick={() =>
                                                            this.sendActivationEmail(user)
                                                        }
                                                    >
                                                        <Icon name="mail" size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <Switch
                                                checked={user.isAdmin}
                                                disabled={disabled}
                                                label={user.username + " est admin"}
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
                {adminChange && (
                    <ConfirmDialog
                        title={
                            (adminChange.isAdmin ? "Donner" : "Retirer") +
                            " les droits d'admin à " +
                            adminChange.user.username +
                            " ?"
                        }
                        danger={!adminChange.isAdmin}
                        onConfirm={this.confirmAdminChange}
                        onClose={() => this.setState({ adminChange: null })}
                    >
                        {adminChange.isAdmin
                            ? "Un admin peut modifier les éditions et les utilisateurs."
                            : "Cet utilisateur n'aura plus accès à l'administration."}
                    </ConfirmDialog>
                )}
            </div>
        );
    }
}

export default UsersAdmin;
