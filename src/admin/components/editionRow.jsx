import React from "react";
import { Button, IconButton } from "../../ui";

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
        const label = isNew ? "nouvelle édition" : "édition " + edition.year;

        return (
            <tr
                className={
                    (isCurrent ? "data-table__row--current" : "") +
                    (dirty && !isNew ? " data-table__row--dirty" : "")
                }
            >
                <td>
                    <div className="data-table__cell-with-tag">
                        <input
                            className="table-input table-input--year"
                            name="year"
                            type="number"
                            value={draft.year}
                            onChange={this.handleChange}
                            placeholder="Année"
                            aria-label={"Année, " + label}
                        />
                        {isNew && <span className="tag">Nouvelle</span>}
                        {isCurrent && <span className="tag tag--primary">En cours</span>}
                    </div>
                </td>
                <td>
                    <input
                        className="table-input"
                        name="weekendDate"
                        type="date"
                        value={draft.weekendDate}
                        onChange={this.handleChange}
                        aria-label={"Date du weekend, " + label}
                    />
                </td>
                <td>
                    <input
                        className="table-input"
                        name="shotgunDate"
                        type="datetime-local"
                        value={draft.shotgunDate}
                        onChange={this.handleChange}
                        aria-label={"Date et heure du shotgun, " + label}
                    />
                </td>
                <td>
                    <input
                        className="table-input table-input--url"
                        name="scoresBoardUrl"
                        type="url"
                        value={draft.scoresBoardUrl}
                        onChange={this.handleChange}
                        placeholder="https://..."
                        aria-label={"Lien du tableau des scores, " + label}
                    />
                </td>
                <td className="data-table__actions">
                    {isNew ? (
                        <Button
                            icon="add"
                            loading={saving}
                            disabled={saving || !this.isValid()}
                            onClick={this.save}
                        >
                            Créer
                        </Button>
                    ) : (
                        <>
                            <IconButton
                                icon="save"
                                variant="filled"
                                label={"Enregistrer l'" + label}
                                disabled={saving || !dirty || !this.isValid()}
                                onClick={this.save}
                            />
                            <IconButton
                                icon="undo"
                                label="Annuler les modifications"
                                disabled={saving || !dirty}
                                onClick={this.reset}
                            />
                            <IconButton
                                icon="delete"
                                className="md-icon-button--danger"
                                label={"Supprimer l'" + label}
                                disabled={saving}
                                onClick={() => onDelete(edition)}
                            />
                        </>
                    )}
                </td>
            </tr>
        );
    }
}

export default EditionRow;
