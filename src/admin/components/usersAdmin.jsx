import React from "react";
import {
    Button,
    Checkbox,
    Confirm,
    Dropdown,
    Icon,
    Input,
    Label,
    Message,
    Table,
} from "semantic-ui-react";

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
        return (
            <Label color="green" size="small">
                {user.room ? user.room.text : "Shotgun"}
            </Label>
        );
    if (user.hasPreShotgun)
        return (
            <Label color="orange" size="small">
                Pré-shotgun
            </Label>
        );
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

        if (loading)
            return (
                <Message info icon>
                    <Icon name="circle notched" loading />
                    <Message.Content>Chargement des utilisateurs...</Message.Content>
                </Message>
            );

        const shownUsers = this.getShownUsers();

        return (
            <div>
                <div
                    className="rowFlex"
                    style={{ flexWrap: "wrap", gap: "1em", marginBottom: "1em" }}
                >
                    <Input
                        icon="search"
                        placeholder="Nom ou email..."
                        value={search}
                        onChange={(event, { value }) => this.setState({ search: value })}
                    />
                    <Dropdown
                        selection
                        options={FILTER_OPTIONS}
                        value={filter}
                        onChange={(event, { value }) => this.setState({ filter: value })}
                    />
                    <span>
                        {shownUsers.length} / {users.length} utilisateurs ·{" "}
                        {users.filter((user) => !user.activated).length} non activés
                    </span>
                </div>
                {error && (
                    <Message error content={error} onDismiss={() => this.setState({ error: "" })} />
                )}
                {success && (
                    <Message
                        success
                        content={success}
                        onDismiss={() => this.setState({ success: "" })}
                    />
                )}
                <Table compact celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Utilisateur</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell collapsing>Activé</Table.HeaderCell>
                            <Table.HeaderCell collapsing>Admin</Table.HeaderCell>
                            <Table.HeaderCell>Shotgun</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {shownUsers.map((user) => {
                            // The back refuses it too: an admin can't lock themselves out
                            const isMe = user.email === me.email;
                            const disabled = isMe || saving[user._id];

                            return (
                                <Table.Row key={user._id} negative={!user.activated}>
                                    <Table.Cell>
                                        {user.username}
                                        {isMe && (
                                            <Label size="mini" style={{ marginLeft: "0.5em" }}>
                                                toi
                                            </Label>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell textAlign="center" style={{ whiteSpace: "nowrap" }}>
                                        <Checkbox
                                            toggle
                                            checked={user.activated}
                                            disabled={disabled}
                                            onChange={(event, { checked }) =>
                                                this.update(user, { activated: checked })
                                            }
                                        />
                                        {!user.activated && (
                                            <Button
                                                basic
                                                compact
                                                size="mini"
                                                icon="envelope"
                                                title="Renvoyer l'email d'activation"
                                                loading={saving[user._id]}
                                                disabled={saving[user._id]}
                                                onClick={() => this.sendActivationEmail(user)}
                                                style={{
                                                    marginLeft: "0.5em",
                                                    verticalAlign: "top",
                                                }}
                                            />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Checkbox
                                            toggle
                                            checked={user.isAdmin}
                                            disabled={disabled}
                                            onChange={(event, { checked }) =>
                                                this.setState({
                                                    adminChange: { user: user, isAdmin: checked },
                                                })
                                            }
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{shotgunCell(user)}</Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
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
                    cancelButton="Annuler"
                    confirmButton="Confirmer"
                    onCancel={() => this.setState({ adminChange: null })}
                    onConfirm={this.confirmAdminChange}
                />
            </div>
        );
    }
}

export default UsersAdmin;
