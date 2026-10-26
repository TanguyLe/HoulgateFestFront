import React from "react";

import EditionRow from "./editionRow";
import { ADMIN_EDITIONS_URL, getAdminEditionUrl } from "../constants";
import { adminGet, adminPost, adminPut, adminDelete } from "../adminApi";
import { Alert, ConfirmDialog } from "../../ui/components";
import { notify } from "../../ui/toast";

const newEditionFor = (editions) => ({
    year: editions.length
        ? Math.max(...editions.map((edition) => edition.year)) + 1
        : new Date().getFullYear(),
});

class EditionsAdmin extends React.Component {
    constructor() {
        super();

        this.state = { loading: true, editions: [], newEdition: {}, error: "", toDelete: null };

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
        });
        if (success) notify.success(success);
    }

    load() {
        adminGet(ADMIN_EDITIONS_URL)
            .then((editions) => this.setEditions(editions))
            .catch((error) => this.setState({ loading: false, error: error.message }));
    }

    create(body) {
        return adminPost(ADMIN_EDITIONS_URL, body)
            .then((created) =>
                this.setEditions(
                    this.state.editions.concat(created),
                    "Édition " + created.year + " créée.",
                ),
            )
            .catch((error) => notify.error(error.message));
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
            .catch((error) => notify.error(error.message));
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
            .catch((error) => notify.error(error.message));
    }

    render() {
        const { loading, editions, newEdition, error, toDelete } = this.state;
        const currentYear = new Date().getFullYear();

        if (loading) return <Alert loading>Chargement des éditions…</Alert>;

        if (error) return <Alert tone="error">{error}</Alert>;

        return (
            <div className="admin-stack">
                <Alert>
                    L'édition en cours est celle de l'année actuelle ({currentYear}) : sa date de
                    shotgun ouvre les réservations et décide du compte à rebours, et son tableau des
                    scores est affiché sur la page Scores.
                </Alert>
                {!editions.some((edition) => edition.year === currentYear) && (
                    <Alert tone="warning" title={"Pas d'édition pour " + currentYear}>
                        Sans édition pour l'année en cours, le shotgun reste fermé.
                    </Alert>
                )}
                <div className="table-wrap">
                    <table className="table">
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
                {toDelete && (
                    <ConfirmDialog
                        title={"Supprimer l'édition " + toDelete.year + " ?"}
                        confirmLabel="Supprimer"
                        danger
                        onConfirm={this.confirmDelete}
                        onClose={() => this.setState({ toDelete: null })}
                    >
                        Weekend du {new Date(toDelete.weekendDate).toLocaleDateString("fr-FR")}.
                        Cette action est définitive.
                    </ConfirmDialog>
                )}
            </div>
        );
    }
}

export default EditionsAdmin;
