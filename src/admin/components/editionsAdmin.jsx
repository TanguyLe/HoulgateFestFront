import React from "react";
import { ConfirmDialog, Loading, Notice } from "../../ui";

import EditionRow from "./editionRow";
import { ADMIN_EDITIONS_URL, getAdminEditionUrl } from "../constants";
import { adminGet, adminPost, adminPut, adminDelete } from "../adminApi";

const newEditionFor = (editions) => ({
    year: editions.length
        ? Math.max(...editions.map((edition) => edition.year)) + 1
        : new Date().getFullYear(),
});

class EditionsAdmin extends React.Component {
    constructor() {
        super();

        this.state = { loading: true, editions: [], newEdition: {}, error: "", success: "" };
        this.state.toDelete = null;

        this.load = this.load.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    setEditions(editions, success = "") {
        editions.sort((a, b) => b.year - a.year);
        this.setState({
            loading: false,
            editions: editions,
            newEdition: newEditionFor(editions),
            error: "",
            success: success,
        });
    }

    showError(error) {
        this.setState({ loading: false, error: error.message, success: "" });
    }

    load() {
        adminGet(ADMIN_EDITIONS_URL)
            .then((editions) => this.setEditions(editions))
            .catch((error) => this.showError(error));
    }

    create(body) {
        return adminPost(ADMIN_EDITIONS_URL, body)
            .then((created) =>
                this.setEditions(
                    this.state.editions.concat(created),
                    "Édition " + created.year + " créée.",
                ),
            )
            .catch((error) => this.showError(error));
    }

    update(editionId, body) {
        return adminPut(getAdminEditionUrl(editionId), body)
            .then((updated) =>
                this.setEditions(
                    this.state.editions.map((edition) =>
                        edition._id === editionId ? updated : edition,
                    ),
                    "Édition " + updated.year + " enregistrée.",
                ),
            )
            .catch((error) => this.showError(error));
    }

    confirmDelete() {
        const toDelete = this.state.toDelete;
        this.setState({ toDelete: null });

        adminDelete(getAdminEditionUrl(toDelete._id))
            .then(() =>
                this.setEditions(
                    this.state.editions.filter((edition) => edition._id !== toDelete._id),
                    "Édition " + toDelete.year + " supprimée.",
                ),
            )
            .catch((error) => this.showError(error));
    }

    render() {
        const { loading, editions, newEdition, error, success, toDelete } = this.state;
        const currentYear = new Date().getFullYear();

        if (loading) return <Loading>Chargement des éditions...</Loading>;

        return (
            <div>
                <Notice kind="info">
                    L'édition en cours est celle de l'année actuelle ({currentYear}) : sa date de
                    shotgun ouvre les réservations et décide du compte à rebours, et son tableau des
                    scores est affiché sur la page Scores.
                </Notice>
                {error && (
                    <Notice kind="error" onDismiss={() => this.setState({ error: "" })}>
                        {error}
                    </Notice>
                )}
                {success && (
                    <Notice kind="success" onDismiss={() => this.setState({ success: "" })}>
                        {success}
                    </Notice>
                )}
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Année</th>
                                <th>Date du weekend</th>
                                <th>Date et heure du shotgun</th>
                                <th>Lien du tableau des scores</th>
                                <th>
                                    <span className="visually-hidden">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <EditionRow edition={newEdition} onSave={this.create} />
                            {editions.map((edition) => (
                                <EditionRow
                                    key={edition._id}
                                    edition={edition}
                                    isCurrent={edition.year === currentYear}
                                    onSave={(body) => this.update(edition._id, body)}
                                    onDelete={(edition) => this.setState({ toDelete: edition })}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {!editions.some((edition) => edition.year === currentYear) && (
                    <Notice kind="warning" title={"Pas d'édition pour " + currentYear}>
                        Sans édition pour l'année en cours, le shotgun reste fermé.
                    </Notice>
                )}
                <ConfirmDialog
                    open={toDelete !== null}
                    title={toDelete ? "Supprimer l'édition " + toDelete.year + " ?" : ""}
                    content={
                        toDelete
                            ? "Weekend du " +
                              new Date(toDelete.weekendDate).toLocaleDateString("fr-FR") +
                              ". Cette action est définitive."
                            : ""
                    }
                    cancelLabel="Annuler"
                    confirmLabel="Supprimer"
                    danger
                    onCancel={() => this.setState({ toDelete: null })}
                    onConfirm={this.confirmDelete}
                />
            </div>
        );
    }
}

export default EditionsAdmin;
