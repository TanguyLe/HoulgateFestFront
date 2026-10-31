import React from "react";
import { ConfirmDialog, Loading, Notice, showError, showSnackbar } from "../../ui";

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

        this.state = { loading: true, editions: [], newEdition: {} };
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
        this.setState({ loading: false, editions: editions, newEdition: newEditionFor(editions) });
        if (success) showSnackbar(success);
    }

    fail(error) {
        this.setState({ loading: false });
        showError(error.message);
    }

    load() {
        adminGet(ADMIN_EDITIONS_URL)
            .then((editions) => this.setEditions(editions))
            .catch((error) => this.fail(error));
    }

    create(body) {
        return adminPost(ADMIN_EDITIONS_URL, body)
            .then((created) =>
                this.setEditions(
                    this.state.editions.concat(created),
                    "Édition " + created.year + " créée.",
                ),
            )
            .catch((error) => this.fail(error));
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
            .catch((error) => this.fail(error));
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
            .catch((error) => this.fail(error));
    }

    render() {
        const { loading, editions, newEdition, toDelete } = this.state;
        const currentYear = new Date().getFullYear();

        if (loading) return <Loading>Chargement des éditions…</Loading>;

        return (
            <div className="admin-section">
                <Notice>
                    L'édition en cours est celle de l'année actuelle ({currentYear}) : sa date de
                    shotgun ouvre les réservations et décide du compte à rebours, et son tableau des
                    scores est affiché sur la page Scores.
                </Notice>
                {!editions.some((edition) => edition.year === currentYear) && (
                    <Notice tone="warning" title={"Pas d'édition pour " + currentYear}>
                        Sans édition pour l'année en cours, le shotgun reste fermé.
                    </Notice>
                )}
                <div className="table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th scope="col">Année</th>
                                <th scope="col">Date du weekend</th>
                                <th scope="col">Date et heure du shotgun</th>
                                <th scope="col">Lien du tableau des scores</th>
                                <th scope="col">
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
                <ConfirmDialog
                    open={toDelete !== null}
                    title={toDelete ? "Supprimer l'édition " + toDelete.year + " ?" : ""}
                    confirmLabel="Supprimer"
                    danger
                    onCancel={() => this.setState({ toDelete: null })}
                    onConfirm={this.confirmDelete}
                >
                    {toDelete &&
                        "Weekend du " +
                            new Date(toDelete.weekendDate).toLocaleDateString("fr-FR") +
                            ". Cette action est définitive."}
                </ConfirmDialog>
            </div>
        );
    }
}

export default EditionsAdmin;
