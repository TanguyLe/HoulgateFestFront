import React from "react";
import { Callout, Confirm, Loading, Spinner } from "../../ui";

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
            }),
        );
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
                        " utilisateur(s) libéré(s).",
                ),
            )
            .catch((error) => this.setState({ error: error.message, success: "" }))
            .finally(() => this.setState({ historizing: false }));
    }

    render() {
        const { loading, shotguns, historyCounts, editions, editionId } = this.state;
        const { confirming, historizing, error, success } = this.state;
        const { users, editing, editError, deleting, saving } = this.state;

        if (loading) return <Loading emoji="🛏️">Chargement des shotguns...</Loading>;

        const edition = this.getEdition();
        const alreadyHistorized = edition ? historyCounts[edition._id] || 0 : 0;
        const preShotguns = shotguns.filter((shotgun) => shotgun.status === "preShotgunned");

        return (
            <div className="stack">
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
                <h3>Shotguns en cours ({shotguns.length})</h3>
                {shotguns.length ? (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Chambre</th>
                                    <th>Propriétaire</th>
                                    <th>Colocataires</th>
                                    <th className="collapsing">Statut</th>
                                    <th className="collapsing">Actions</th>
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
                                        <td className="nowrap">
                                            {shotgun.status === "shotgunned" ? (
                                                <span className="chip chip--free">Shotgun</span>
                                            ) : (
                                                <span className="chip chip--pending">
                                                    Pré-shotgun
                                                </span>
                                            )}
                                        </td>
                                        <td className="nowrap">
                                            <div className="row admin__actions">
                                                <button
                                                    type="button"
                                                    className="btn btn--sm btn--icon"
                                                    title="Modifier les personnes"
                                                    aria-label="Modifier les personnes"
                                                    disabled={saving || !shotgun.room}
                                                    onClick={() =>
                                                        this.setState({
                                                            editing: shotgun,
                                                            editError: "",
                                                        })
                                                    }
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn--sm btn--icon btn--soft-danger"
                                                    title="Supprimer"
                                                    aria-label="Supprimer"
                                                    disabled={saving}
                                                    onClick={() =>
                                                        this.setState({ deleting: shotgun })
                                                    }
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="muted">Aucun shotgun en cours.</p>
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
                    confirmLabel="Supprimer"
                    danger
                    onCancel={() => this.setState({ deleting: null })}
                    onConfirm={this.deleteShotgun}
                />

                <h3>Historiser les shotguns</h3>
                <p>
                    Archive les shotguns dans l'historique de l'édition choisie, puis libère toutes
                    les chambres et tous les utilisateurs pour l'édition suivante. Les pré-shotguns
                    (réservations pas terminées) sont abandonnés.
                </p>
                <div className="row">
                    <select
                        className="select admin__select"
                        aria-label="Édition"
                        value={editionId || ""}
                        onChange={(event) => this.setState({ editionId: event.target.value })}
                    >
                        <option value="" disabled>
                            Édition
                        </option>
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
                        {historizing ? <Spinner /> : "🗄"} Historiser
                    </button>
                </div>
                {edition && alreadyHistorized > 0 && shotguns.length > 0 && (
                    <Callout kind="warning">
                        L'édition {edition.year} a déjà {alreadyHistorized} shotgun(s) dans
                        l'historique : ceux des mêmes propriétaires seront remplacés.
                    </Callout>
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
                    confirmLabel="Historiser"
                    danger
                    onCancel={() => this.setState({ confirming: false })}
                    onConfirm={this.historize}
                />
            </div>
        );
    }
}

export default ShotgunsAdmin;
