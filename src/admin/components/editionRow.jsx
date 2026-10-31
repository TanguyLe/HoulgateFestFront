import React from "react";

import { toDateInput, toDatetimeInput, fromDateInput, fromDatetimeInput } from "../adminApi";
import { Spinner, Tag, cx } from "../../ui";

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
            <tr className={cx(isCurrent && "row--ok", dirty && !isNew && "row--warn")}>
                <td className="nowrap">
                    <input
                        className="input"
                        name="year"
                        type="number"
                        value={draft.year}
                        onChange={this.handleChange}
                        placeholder="Année"
                        aria-label={"Année, " + label}
                        style={{ width: "6.5em" }}
                    />{" "}
                    {isNew && <Tag>Nouvelle</Tag>}
                    {isCurrent && <Tag tone="ok">En cours</Tag>}
                </td>
                <td>
                    <input
                        className="input"
                        name="weekendDate"
                        type="date"
                        value={draft.weekendDate}
                        onChange={this.handleChange}
                        aria-label={"Date du weekend, " + label}
                    />
                </td>
                <td>
                    <input
                        className="input"
                        name="shotgunDate"
                        type="datetime-local"
                        value={draft.shotgunDate}
                        onChange={this.handleChange}
                        aria-label={"Date et heure du shotgun, " + label}
                    />
                </td>
                <td style={{ minWidth: "14em" }}>
                    <input
                        className="input"
                        name="scoresBoardUrl"
                        type="url"
                        value={draft.scoresBoardUrl}
                        onChange={this.handleChange}
                        placeholder="https://..."
                        aria-label={"Lien du tableau des scores, " + label}
                    />
                </td>
                <td className="nowrap">
                    {isNew ? (
                        <button
                            type="button"
                            className="btn btn--small btn--primary"
                            disabled={saving || !this.isValid()}
                            onClick={this.save}
                        >
                            {saving && <Spinner />} Créer
                        </button>
                    ) : (
                        <div className="btn-row">
                            <button
                                type="button"
                                className="btn btn--small btn--primary"
                                title="Enregistrer"
                                disabled={saving || !dirty || !this.isValid()}
                                onClick={this.save}
                            >
                                {saving && <Spinner />} Enregistrer
                            </button>
                            <button
                                type="button"
                                className="btn btn--small"
                                title="Annuler les modifications"
                                disabled={saving || !dirty}
                                onClick={this.reset}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn btn--small btn--danger"
                                title="Supprimer"
                                disabled={saving}
                                onClick={() => onDelete(edition)}
                            >
                                Supprimer
                            </button>
                        </div>
                    )}
                </td>
            </tr>
        );
    }
}

export default EditionRow;
