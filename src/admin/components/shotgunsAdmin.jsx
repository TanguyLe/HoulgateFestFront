import React from "react";

import Icon from "../../ui/icon";
import { Alert, ConfirmDialog } from "../../ui/components";
import { notify } from "../../ui/toast";
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

    return edition ? edition._id : "";
};

class ShotgunsAdmin extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            shotguns: [],
            historyCounts: {},
            editions: [],
            editionId: "",
            confirming: false,
            historizing: false,
            error: "",
            users: [],
            editing: null,
            editError: "",
            deleting: null,
            saving: false,
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
        return adminGet(ADMIN_SHOTGUNS_URL).then((shotguns) => {
            this.setState({ shotguns: shotguns.shotguns, historyCounts: shotguns.historyCounts });
            notify.success(success);
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
            .catch((error) => notify.error(error.message))
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
            .catch((error) => notify.error(error.message))
            .finally(() => this.setState({ historizing: false }));
    }

    render() {
        const { loading, shotguns, historyCounts, editions, editionId } = this.state;
        const { confirming, historizing, error } = this.state;
        const { users, editing, editError, deleting, saving } = this.state;

        if (loading) return <Alert loading>Chargement des shotguns…</Alert>;

        if (error) return <Alert tone="error">{error}</Alert>;

        const edition = this.getEdition();
        const alreadyHistorized = edition ? historyCounts[edition._id] || 0 : 0;
        const preShotguns = shotguns.filter((shotgun) => shotgun.status === "preShotgunned");

        return (
            <div className="admin-stack">
                <h2>Shotguns en cours ({shotguns.length})</h2>
                {shotguns.length ? (
                    <div className="table-wrap">
                        <table className="table">
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
                                        <td>{shotgun.room ? shotgun.room.text : "?"}</td>
                                        <td>{shotgun.user ? shotgun.user.username : "?"}</td>
                                        <td>
                                            {shotgun.roommates
                                                .map((roommate) => roommate.username)
                                                .join(", ") || "—"}
                                        </td>
                                        <td>
                                            {shotgun.status === "shotgunned" ? (
                                                <span className="chip chip--sm chip--success">
                                                    Shotgun
                                                </span>
                                            ) : (
                                                <span className="chip chip--sm chip--warning">
                                                    Pré-shotgun
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="table__actions">
                                                <button
                                                    type="button"
                                                    className="btn btn--icon btn--sm"
                                                    title="Modifier les personnes"
                                                    aria-label={
                                                        "Modifier les personnes de la chambre " +
                                                        (shotgun.room ? shotgun.room.text : "?")
                                                    }
                                                    disabled={saving || !shotgun.room}
                                                    onClick={() =>
                                                        this.setState({
                                                            editing: shotgun,
                                                            editError: "",
                                                        })
                                                    }
                                                >
                                                    <Icon name="users" size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn--ghost btn--icon btn--sm"
                                                    title="Supprimer"
                                                    aria-label={
                                                        "Supprimer le shotgun de la chambre " +
                                                        (shotgun.room ? shotgun.room.text : "?")
                                                    }
                                                    disabled={saving}
                                                    onClick={() =>
                                                        this.setState({ deleting: shotgun })
                                                    }
                                                >
                                                    <Icon name="trash" size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Aucun shotgun en cours.</p>
                )}

                <h2>Historiser les shotguns</h2>
                <p>
                    Archive les shotguns dans l'historique de l'édition choisie, puis libère toutes
                    les chambres et tous les utilisateurs pour l'édition suivante. Les pré-shotguns
                    (réservations pas terminées) sont abandonnés.
                </p>
                <div className="admin-toolbar">
                    <select
                        className="field__control"
                        aria-label="Édition à historiser"
                        value={editionId}
                        onChange={(event) => this.setState({ editionId: event.target.value })}
                    >
                        {!editions.length && <option value="">Aucune édition</option>}
                        {editions.map((edition) => (
                            <option key={edition._id} value={edition._id}>
                                {edition.year +
                                    (historyCounts[edition._id]
                                        ? " (" + historyCounts[edition._id] + " déjà historisés)"
                                        : "")}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="btn btn--danger"
                        disabled={!edition || historizing || shotguns.length === 0}
                        onClick={() => this.setState({ confirming: true })}
                    >
                        <Icon name="archive" size={18} />
                        {historizing ? "Historisation…" : "Historiser"}
                    </button>
                </div>
                {edition && alreadyHistorized > 0 && shotguns.length > 0 && (
                    <Alert tone="warning">
                        L'édition {edition.year} a déjà {alreadyHistorized} shotgun(s) dans
                        l'historique : ceux des mêmes propriétaires seront remplacés.
                    </Alert>
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
                {deleting && (
                    <ConfirmDialog
                        title={
                            "Supprimer le " +
                            (deleting.status === "shotgunned" ? "shotgun" : "pré-shotgun") +
                            " de la chambre " +
                            (deleting.room ? deleting.room.text : "?") +
                            " ?"
                        }
                        confirmLabel="Supprimer"
                        danger
                        onConfirm={this.deleteShotgun}
                        onClose={() => this.setState({ deleting: null })}
                    >
                        La chambre et toutes ses personnes seront libérées. Personne n'est prévenu
                        par email.
                    </ConfirmDialog>
                )}
                {confirming && edition && (
                    <ConfirmDialog
                        title={"Historiser les shotguns de " + edition.year + " ?"}
                        confirmLabel="Historiser"
                        danger
                        onConfirm={this.historize}
                        onClose={() => this.setState({ confirming: false })}
                    >
                        {shotguns.length - preShotguns.length} shotgun(s) seront archivés
                        {preShotguns.length
                            ? " et " + preShotguns.length + " pré-shotgun(s) abandonné(s)"
                            : ""}
                        . Toutes les chambres seront libérées : personne ne pourra plus voir ces
                        shotguns sur la page Shotgun.
                    </ConfirmDialog>
                )}
            </div>
        );
    }
}

export default ShotgunsAdmin;
