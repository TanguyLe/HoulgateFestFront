import React from "react";

import { Spinner } from "../../ui";
import { toDateInput, toDatetimeInput, fromDateInput, fromDatetimeInput } from "../adminApi";

const toDraft = (edition) => ({
    year: edition.year !== undefined ? String(edition.year) : "",
    weekendDate: toDateInput(edition.weekendDate),
    shotgunDate: toDatetimeInput(edition.shotgunDate),
    scoresBoardUrl: edition.scoresBoardUrl || "",
});

const fromDraft = (draft) => ({
    year: Number(draft.year),
    weekendDate: fromDateInput(draft.weekendDate),
    shotgunDate: fromDatetimeInput(draft.shotgunDate),
    scoresBoardUrl: draft.scoresBoardUrl.trim(),
});

// One edition as an editable table row, also used (without `edition._id`) to create a new one
class EditionRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = { draft: toDraft(props.edition), saving: false };

        this.handleChange = this.handleChange.bind(this);
        this.reset = this.reset.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.edition !== this.props.edition) this.reset();
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ draft: Object.assign({}, this.state.draft, { [name]: value }) });
    }

    reset() {
        this.setState({ draft: toDraft(this.props.edition) });
    }

    isDirty() {
        const initial = toDraft(this.props.edition);
        return Object.keys(initial).some((key) => initial[key] !== this.state.draft[key]);
    }

    isValid() {
        const { year, weekendDate, shotgunDate, scoresBoardUrl } = this.state.draft;
        return (
            /^\d{4}$/.test(year) &&
            weekendDate &&
            shotgunDate &&
            (!scoresBoardUrl.trim() || /^https:\/\/\S+$/.test(scoresBoardUrl.trim()))
        );
    }

    save() {
        this.setState({ saving: true });
        this.props
            .onSave(fromDraft(this.state.draft))
            .finally(() => this.setState({ saving: false }));
    }

    render() {
        const { edition, isCurrent, onDelete } = this.props;
        const { draft, saving } = this.state;
        const isNew = !edition._id;
        const dirty = this.isDirty();

        return (
            <tr className={isCurrent ? "is-positive" : dirty && !isNew ? "is-warning" : ""}>
                <td className="nowrap">
                    <input
                        className="input input--sm"
                        name="year"
                        type="number"
                        aria-label="Année"
                        value={draft.year}
                        onChange={this.handleChange}
                        placeholder="Année"
                        style={{ width: "6.5em" }}
                    />
                    {isNew && <span className="chip chip--info admin__tag">Nouvelle</span>}
                    {isCurrent && <span className="chip chip--free admin__tag">En cours</span>}
                </td>
                <td>
                    <input
                        className="input input--sm"
                        name="weekendDate"
                        type="date"
                        aria-label="Date du weekend"
                        value={draft.weekendDate}
                        onChange={this.handleChange}
                    />
                </td>
                <td>
                    <input
                        className="input input--sm"
                        name="shotgunDate"
                        type="datetime-local"
                        aria-label="Date et heure du shotgun"
                        value={draft.shotgunDate}
                        onChange={this.handleChange}
                    />
                </td>
                <td>
                    <input
                        className="input input--sm"
                        name="scoresBoardUrl"
                        type="url"
                        aria-label="Lien du tableau des scores"
                        value={draft.scoresBoardUrl}
                        onChange={this.handleChange}
                        placeholder="https://..."
                        style={{ minWidth: "14em" }}
                    />
                </td>
                <td className="collapsing">
                    {isNew ? (
                        <button
                            type="button"
                            className="btn btn--sm btn--primary"
                            disabled={saving || !this.isValid()}
                            onClick={this.save}
                        >
                            {saving ? <Spinner /> : "＋"} Créer
                        </button>
                    ) : (
                        <div className="row admin__actions">
                            <button
                                type="button"
                                className="btn btn--sm btn--icon btn--primary"
                                title="Enregistrer"
                                aria-label="Enregistrer"
                                disabled={saving || !dirty || !this.isValid()}
                                onClick={this.save}
                            >
                                {saving ? <Spinner /> : "💾"}
                            </button>
                            <button
                                type="button"
                                className="btn btn--sm btn--icon"
                                title="Annuler les modifications"
                                aria-label="Annuler les modifications"
                                disabled={saving || !dirty}
                                onClick={this.reset}
                            >
                                ↩
                            </button>
                            <button
                                type="button"
                                className="btn btn--sm btn--icon btn--soft-danger"
                                title="Supprimer"
                                aria-label="Supprimer"
                                disabled={saving}
                                onClick={() => onDelete(edition)}
                            >
                                🗑
                            </button>
                        </div>
                    )}
                </td>
            </tr>
        );
    }
}

export default EditionRow;
