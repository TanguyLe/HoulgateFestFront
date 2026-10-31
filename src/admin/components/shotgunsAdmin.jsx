import React from "react";
import {
    Button,
    ConfirmDialog,
    IconButton,
    Loading,
    Notice,
    Select,
    showError,
    showSnackbar,
} from "../../ui";

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
            .catch((error) => {
                this.setState({ loading: false });
                showError(error.message);
            });
    }

    getEdition() {
        return this.state.editions.find((edition) => edition._id === this.state.editionId);
    }

    // The edition or the deletion may also have freed or expired other shotguns: reload them all
    reloadShotguns(success) {
        return adminGet(ADMIN_SHOTGUNS_URL).then((shotguns) => {
            this.setState({ shotguns: shotguns.shotguns, historyCounts: shotguns.historyCounts });
            showSnackbar(success);
        });
    }

    saveShotgun(change) {
        const shotgun = this.state.editing;
        this.setState({ saving: true });

        adminPut(getAdminShotgunUrl(shotgun._id), change)
            .then(() => {
                this.setState({ editing: null, editError: "" });
                return this.reloadShotguns(
                    "Shotgun de la chambre " + shotgun.room.text + " modifié.",
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
                        " utilisateur(s) libéré(s).",
                ),
            )
            .catch((error) => showError(error.message))
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
                        " utilisateur(s) libéré(s).",
                ),
            )
            .catch((error) => showError(error.message))
            .finally(() => this.setState({ historizing: false }));
    }

    render() {
        const { loading, shotguns, historyCounts, editions, editionId } = this.state;
        const { confirming, historizing } = this.state;
        const { users, editing, editError, deleting, saving } = this.state;

        if (loading) return <Loading>Chargement des shotguns…</Loading>;

        const edition = this.getEdition();
        const alreadyHistorized = edition ? historyCounts[edition._id] || 0 : 0;
        const preShotguns = shotguns.filter((shotgun) => shotgun.status === "preShotgunned");
        const roomName = (shotgun) => (shotgun.room ? shotgun.room.text : "?");

        return (
            <div className="admin-section">
                <h2 className="title-large">Shotguns en cours ({shotguns.length})</h2>
                {shotguns.length ? (
                    <div className="table-scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th scope="col">Chambre</th>
                                    <th scope="col">Propriétaire</th>
                                    <th scope="col">Colocataires</th>
                                    <th scope="col">Statut</th>
                                    <th scope="col">
                                        <span className="visually-hidden">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {shotguns.map((shotgun) => (
                                    <tr key={shotgun._id}>
                                        <th scope="row">{roomName(shotgun)}</th>
                                        <td>{shotgun.user ? shotgun.user.username : "?"}</td>
                                        <td>
                                            {shotgun.roommates
                                                .map((roommate) => roommate.username)
                                                .join(", ") || "—"}
                                        </td>
                                        <td>
                                            {shotgun.status === "shotgunned" ? (
                                                <span className="tag tag--primary">Shotgun</span>
                                            ) : (
                                                <span className="tag tag--tertiary">
                                                    Pré-shotgun
                                                </span>
                                            )}
                                        </td>
                                        <td className="data-table__actions">
                                            <IconButton
                                                icon="edit"
                                                label={
                                                    "Modifier les personnes de " + roomName(shotgun)
                                                }
                                                disabled={saving || !shotgun.room}
                                                onClick={() =>
                                                    this.setState({
                                                        editing: shotgun,
                                                        editError: "",
                                                    })
                                                }
                                            />
                                            <IconButton
                                                icon="delete"
                                                className="md-icon-button--danger"
                                                label={
                                                    "Supprimer le shotgun de " + roomName(shotgun)
                                                }
                                                disabled={saving}
                                                onClick={() => this.setState({ deleting: shotgun })}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="body-medium on-surface-variant">Aucun shotgun en cours.</p>
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
                <ConfirmDialog
                    open={deleting !== null}
                    title={
                        deleting
                            ? "Supprimer le " +
                              (deleting.status === "shotgunned" ? "shotgun" : "pré-shotgun") +
                              " de la chambre " +
                              roomName(deleting) +
                              " ?"
                            : ""
                    }
                    confirmLabel="Supprimer"
                    danger
                    onCancel={() => this.setState({ deleting: null })}
                    onConfirm={this.deleteShotgun}
                >
                    La chambre et toutes ses personnes seront libérées. Personne n'est prévenu par
                    email.
                </ConfirmDialog>

                <h2 className="title-large admin-section__title">Historiser les shotguns</h2>
                <p className="body-medium prose">
                    Archive les shotguns dans l'historique de l'édition choisie, puis libère toutes
                    les chambres et tous les utilisateurs pour l'édition suivante. Les pré-shotguns
                    (réservations pas terminées) sont abandonnés.
                </p>
                <div className="admin-toolbar">
                    <Select
                        label="Édition"
                        placeholder={editionId ? undefined : "Édition"}
                        value={editionId || ""}
                        options={editions.map((edition) => ({
                            value: edition._id,
                            label:
                                edition.year +
                                (historyCounts[edition._id]
                                    ? " (" + historyCounts[edition._id] + " déjà historisés)"
                                    : ""),
                        }))}
                        onChange={(event) => this.setState({ editionId: event.target.value })}
                    />
                    <Button
                        icon="archive"
                        className="md-button--danger"
                        loading={historizing}
                        disabled={!edition || historizing || shotguns.length === 0}
                        onClick={() => this.setState({ confirming: true })}
                    >
                        Historiser
                    </Button>
                </div>
                {edition && alreadyHistorized > 0 && shotguns.length > 0 && (
                    <Notice tone="warning">
                        L'édition {edition.year} a déjà {alreadyHistorized} shotgun(s) dans
                        l'historique : ceux des mêmes propriétaires seront remplacés.
                    </Notice>
                )}
                <ConfirmDialog
                    open={confirming}
                    title={edition ? "Historiser les shotguns de " + edition.year + " ?" : ""}
                    confirmLabel="Historiser"
                    danger
                    onCancel={() => this.setState({ confirming: false })}
                    onConfirm={this.historize}
                >
                    {shotguns.length -
                        preShotguns.length +
                        " shotgun(s) seront archivés" +
                        (preShotguns.length
                            ? " et " + preShotguns.length + " pré-shotgun(s) abandonné(s)"
                            : "") +
                        ". Toutes les chambres seront libérées : personne ne pourra plus voir ces" +
                        " shotguns sur la page Shotgun."}
                </ConfirmDialog>
            </div>
        );
    }
}

export default ShotgunsAdmin;
