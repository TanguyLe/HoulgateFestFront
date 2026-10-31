import React from "react";
import {
    ConfirmDialog,
    IconButton,
    Loading,
    Select,
    Switch,
    TextField,
    showError,
    showSnackbar,
} from "../../ui";

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
    value: key,
    label: FILTERS[key].text,
}));

const shotgunCell = (user) => {
    if (user.hasShotgun)
        return <span className="tag tag--primary">{user.room ? user.room.text : "Shotgun"}</span>;
    if (user.hasPreShotgun) return <span className="tag tag--tertiary">Pré-shotgun</span>;
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
            adminChange: null,
        };

        this.update = this.update.bind(this);
        this.confirmAdminChange = this.confirmAdminChange.bind(this);
        this.sendActivationEmail = this.sendActivationEmail.bind(this);
    }

    componentDidMount() {
        adminGet(ADMIN_USERS_URL)
            .then((users) => this.setState({ loading: false, users: users }))
            .catch((error) => {
                this.setState({ loading: false });
                showError(error.message);
            });
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
            .catch((error) => showError(error.message))
            .finally(() => this.setSaving(user._id, false));
    }

    sendActivationEmail(user) {
        this.setSaving(user._id, true);
        adminPost(getAdminActivationEmailUrl(user._id))
            .then(() => showSnackbar("Email d'activation renvoyé à " + user.email + "."))
            .catch((error) => showError(error.message))
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
        const { loading, users, search, filter, saving, adminChange } = this.state;
        const { me } = this.props;

        if (loading) return <Loading>Chargement des utilisateurs…</Loading>;

        const shownUsers = this.getShownUsers();

        return (
            <div className="admin-section">
                <div className="admin-toolbar">
                    <TextField
                        label="Rechercher"
                        leadingIcon="search"
                        type="search"
                        placeholder=" "
                        supportingText="Nom ou email"
                        value={search}
                        onChange={(event) => this.setState({ search: event.target.value })}
                    />
                    <Select
                        label="Afficher"
                        options={FILTER_OPTIONS}
                        value={filter}
                        onChange={(event) => this.setState({ filter: event.target.value })}
                    />
                    <p className="body-medium on-surface-variant" aria-live="polite">
                        {shownUsers.length} / {users.length} utilisateurs ·{" "}
                        {users.filter((user) => !user.activated).length} non activés
                    </p>
                </div>
                <div className="table-scroll">
                    <table className="data-table">
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
                                        className={user.activated ? "" : "data-table__row--muted"}
                                    >
                                        <th scope="row">
                                            <div className="data-table__cell-with-tag">
                                                {user.username}
                                                {isMe && <span className="tag">toi</span>}
                                            </div>
                                        </th>
                                        <td>{user.email}</td>
                                        <td>
                                            <div className="data-table__cell-with-tag">
                                                <Switch
                                                    label={"Compte de " + user.username + " activé"}
                                                    hideLabel
                                                    checked={user.activated}
                                                    disabled={disabled}
                                                    onChange={(event) =>
                                                        this.update(user, {
                                                            activated: event.target.checked,
                                                        })
                                                    }
                                                />
                                                {!user.activated && (
                                                    <IconButton
                                                        icon="outgoingMail"
                                                        label={
                                                            "Renvoyer l'email d'activation à " +
                                                            user.username
                                                        }
                                                        disabled={saving[user._id]}
                                                        onClick={() =>
                                                            this.sendActivationEmail(user)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <Switch
                                                label={user.username + " est admin"}
                                                hideLabel
                                                checked={user.isAdmin}
                                                disabled={disabled}
                                                onChange={(event) =>
                                                    this.setState({
                                                        adminChange: {
                                                            user: user,
                                                            isAdmin: event.target.checked,
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
                <ConfirmDialog
                    open={adminChange !== null}
                    title={
                        adminChange
                            ? (adminChange.isAdmin ? "Donner" : "Retirer") +
                              " les droits d'admin à " +
                              adminChange.user.username +
                              " ?"
                            : ""
                    }
                    onCancel={() => this.setState({ adminChange: null })}
                    onConfirm={this.confirmAdminChange}
                >
                    {adminChange && adminChange.isAdmin
                        ? "Un admin peut modifier les éditions et les utilisateurs."
                        : "Cet utilisateur n'aura plus accès à l'administration."}
                </ConfirmDialog>
            </div>
        );
    }
}

export default UsersAdmin;
