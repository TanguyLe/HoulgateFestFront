import React from "react";
import { Button, Confirm, Dropdown, Header, Icon, Label, Message, Table } from "semantic-ui-react";

import {
    ADMIN_EDITIONS_URL,
    ADMIN_SHOTGUNS_URL,
    ADMIN_HISTORIZE_URL,
    ADMIN_USERS_URL,
    getAdminShotgunUrl,
} from "../constants";
import { adminDelete, adminGet, adminPost, adminPut } from "../adminApi";
import ShotgunEditModal from "./shotgunEditModal";

// The shotguns usually belong to the last edition whose shotgun has opened
const getDefaultEditionId = (editions) => {
    const now = new Date();
    const opened = editions.filter((edition) => new Date(edition.shotgunDate) <= now);
    const edition = opened.length ? opened[0] : editions[0];

    return edition ? edition._id : null;
};

class ShotgunsAdmin extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            shotguns: [],
            historyCounts: {},
            editions: [],
            editionId: null,
            users: [],
            editing: null,
            editError: "",
            deleting: null,
            saving: false,
            confirming: false,
            historizing: false,
            error: "",
            success: "",
        };

        this.historize = this.historize.bind(this);
        this.saveShotgun = this.saveShotgun.bind(this);
        this.deleteShotgun = this.deleteShotgun.bind(this);
    }

    componentDidMount() {
        Promise.all([
            adminGet(ADMIN_SHOTGUNS_URL),
            adminGet(ADMIN_EDITIONS_URL),
            adminGet(ADMIN_USERS_URL),
        ])
            .then(([shotguns, editions, users]) => {
                editions.sort((a, b) => b.year - a.year);
                this.setState({
                    loading: false,
                    shotguns: shotguns.shotguns,
                    historyCounts: shotguns.historyCounts,
                    editions: editions,
                    editionId: getDefaultEditionId(editions),
                    users: users,
                });
            })
            .catch((error) => this.setState({ loading: false, error: error.message }));
    }

    getEdition() {
        return this.state.editions.find((edition) => edition._id === this.state.editionId);
    }

    // The edition or the deletion may also have freed or expired other shotguns: reload them all
    reloadShotguns(success) {
        return adminGet(ADMIN_SHOTGUNS_URL).then((shotguns) =>
            this.setState({
                shotguns: shotguns.shotguns,
                historyCounts: shotguns.historyCounts,
                error: "",
                success: success,
            })
        );
    }

    saveShotgun(change) {
        const shotgun = this.state.editing;
        this.setState({ saving: true });

        adminPut(getAdminShotgunUrl(shotgun._id), change)
            .then(() => {
                this.setState({ editing: null, editError: "" });
                return this.reloadShotguns(
                    "Shotgun de la chambre " + shotgun.room.text + " modifié."
                );
            })
            .catch((error) => this.setState({ editError: error.message }))
            .finally(() => this.setState({ saving: false }));
    }

    deleteShotgun() {
        const shotgun = this.state.deleting;
        this.setState({ deleting: null, saving: true });

        adminDelete(getAdminShotgunUrl(shotgun._id))
            .then((result) =>
                this.reloadShotguns(
                    "Shotgun de la chambre " +
                        (shotgun.room ? shotgun.room.text : "?") +
                        " supprimé, " +
                        result.usersReset +
                        " utilisateur(s) libéré(s)."
                )
            )
            .catch((error) => this.setState({ error: error.message, success: "" }))
            .finally(() => this.setState({ saving: false }));
    }

    historize() {
        const edition = this.getEdition();
        this.setState({ confirming: false, historizing: true });

        adminPost(ADMIN_HISTORIZE_URL, { editionId: edition._id })
            .then((result) =>
                this.reloadShotguns(
                    result.historized +
                        " shotgun(s) historisé(s) pour " +
                        edition.year +
                        ", " +
                        result.droppedPreShotguns +
                        " pré-shotgun(s) abandonné(s), " +
                        result.usersReset +
                        " utilisateur(s) libéré(s)."
                )
            )
            .catch((error) => this.setState({ error: error.message, success: "" }))
            .finally(() => this.setState({ historizing: false }));
    }

    render() {
        const { loading, shotguns, historyCounts, editions, editionId } = this.state;
        const { confirming, historizing, error, success } = this.state;
        const { users, editing, editError, deleting, saving } = this.state;

        if (loading)
            return (
                <Message info icon>
                    <Icon name="circle notched" loading />
                    <Message.Content>Chargement des shotguns...</Message.Content>
                </Message>
            );

        const edition = this.getEdition();
        const alreadyHistorized = edition ? historyCounts[edition._id] || 0 : 0;
        const preShotguns = shotguns.filter((shotgun) => shotgun.status === "preShotgunned");

        return (
            <div>
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
                <Header as="h3">Shotguns en cours ({shotguns.length})</Header>
                {shotguns.length ? (
                    <Table compact celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Chambre</Table.HeaderCell>
                                <Table.HeaderCell>Propriétaire</Table.HeaderCell>
                                <Table.HeaderCell>Colocataires</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Statut</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {shotguns.map((shotgun) => (
                                <Table.Row key={shotgun._id}>
                                    <Table.Cell>
                                        {shotgun.room ? shotgun.room.text : "?"}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {shotgun.user ? shotgun.user.username : "?"}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {shotgun.roommates
                                            .map((roommate) => roommate.username)
                                            .join(", ") || "—"}
                                    </Table.Cell>
                                    <Table.Cell style={{ whiteSpace: "nowrap" }}>
                                        {shotgun.status === "shotgunned" ? (
                                            <Label color="green" size="small">
                                                Shotgun
                                            </Label>
                                        ) : (
                                            <Label color="orange" size="small">
                                                Pré-shotgun
                                            </Label>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell style={{ whiteSpace: "nowrap" }}>
                                        <Button
                                            compact
                                            size="small"
                                            icon="edit"
                                            title="Modifier les personnes"
                                            disabled={saving || !shotgun.room}
                                            onClick={() =>
                                                this.setState({ editing: shotgun, editError: "" })
                                            }
                                        />
                                        <Button
                                            compact
                                            negative
                                            size="small"
                                            icon="trash"
                                            title="Supprimer"
                                            disabled={saving}
                                            onClick={() => this.setState({ deleting: shotgun })}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                ) : (
                    <p>Aucun shotgun en cours.</p>
                )}

                {editing && (
                    <ShotgunEditModal
                        shotgun={editing}
                        shotguns={shotguns}
                        users={users}
                        saving={saving}
                        error={editError}
                        onSave={this.saveShotgun}
                        onClose={() => this.setState({ editing: null })}
                    />
                )}
                <Confirm
                    open={deleting !== null}
                    header={
                        deleting
                            ? "Supprimer le " +
                              (deleting.status === "shotgunned" ? "shotgun" : "pré-shotgun") +
                              " de la chambre " +
                              (deleting.room ? deleting.room.text : "?") +
                              " ?"
                            : ""
                    }
                    content="La chambre et toutes ses personnes seront libérées. Personne n'est prévenu par email."
                    cancelButton="Annuler"
                    confirmButton={{ content: "Supprimer", negative: true }}
                    onCancel={() => this.setState({ deleting: null })}
                    onConfirm={this.deleteShotgun}
                />

                <Header as="h3">Historiser les shotguns</Header>
                <p>
                    Archive les shotguns dans l'historique de l'édition choisie, puis libère toutes
                    les chambres et tous les utilisateurs pour l'édition suivante. Les pré-shotguns
                    (réservations pas terminées) sont abandonnés.
                </p>
                <div className="rowFlex" style={{ flexWrap: "wrap", gap: "1em" }}>
                    <Dropdown
                        selection
                        placeholder="Édition"
                        value={editionId}
                        options={editions.map((edition) => ({
                            key: edition._id,
                            value: edition._id,
                            text:
                                edition.year +
                                (historyCounts[edition._id]
                                    ? " (" + historyCounts[edition._id] + " déjà historisés)"
                                    : ""),
                        }))}
                        onChange={(event, { value }) => this.setState({ editionId: value })}
                    />
                    <Button
                        negative
                        icon="archive"
                        content="Historiser"
                        loading={historizing}
                        disabled={!edition || historizing || shotguns.length === 0}
                        onClick={() => this.setState({ confirming: true })}
                    />
                </div>
                {edition && alreadyHistorized > 0 && shotguns.length > 0 && (
                    <Message warning size="small">
                        L'édition {edition.year} a déjà {alreadyHistorized} shotgun(s) dans
                        l'historique : ceux des mêmes propriétaires seront remplacés.
                    </Message>
                )}
                <Confirm
                    open={confirming}
                    header={edition ? "Historiser les shotguns de " + edition.year + " ?" : ""}
                    content={
                        shotguns.length -
                        preShotguns.length +
                        " shotgun(s) seront archivés" +
                        (preShotguns.length
                            ? " et " + preShotguns.length + " pré-shotgun(s) abandonné(s)"
                            : "") +
                        ". Toutes les chambres seront libérées : personne ne pourra plus voir ces" +
                        " shotguns sur la page Shotgun."
                    }
                    cancelButton="Annuler"
                    confirmButton={{ content: "Historiser", negative: true }}
                    onCancel={() => this.setState({ confirming: false })}
                    onConfirm={this.historize}
                />
            </div>
        );
    }
}

export default ShotgunsAdmin;
