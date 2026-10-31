import React from "react";
import { Badge, Button } from "../../ui";

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

        const input = (name, type, extra = {}) => (
            <input
                className="field__input"
                name={name}
                type={type}
                value={draft[name]}
                onChange={this.handleChange}
                aria-label={extra.label}
                placeholder={extra.placeholder}
                style={extra.style}
            />
        );

        return (
            <tr className={isCurrent ? "row--ok" : dirty && !isNew ? "row--warn" : ""}>
                <td className="cell--nowrap">
                    {input("year", "number", {
                        label: "Année",
                        placeholder: "Année",
                        style: { width: "6.5em" },
                    })}
                    {isNew && <Badge className="admin-badge">Nouvelle</Badge>}
                    {isCurrent && (
                        <Badge tone="ok" className="admin-badge">
                            En cours
                        </Badge>
                    )}
                </td>
                <td>{input("weekendDate", "date", { label: "Date du weekend" })}</td>
                <td>{input("shotgunDate", "datetime-local", { label: "Date du shotgun" })}</td>
                <td>
                    {input("scoresBoardUrl", "url", {
                        label: "Lien du tableau des scores",
                        placeholder: "https://...",
                        style: { minWidth: "14em" },
                    })}
                </td>
                <td className="cell--right cell--nowrap">
                    {isNew ? (
                        <Button
                            variant="primary"
                            size="sm"
                            icon="plus"
                            loading={saving}
                            disabled={saving || !this.isValid()}
                            onClick={this.save}
                        >
                            Créer
                        </Button>
                    ) : (
                        <span className="btn-group">
                            <Button
                                variant="primary"
                                size="sm"
                                className="btn--icon"
                                icon="save"
                                title="Enregistrer"
                                aria-label="Enregistrer"
                                loading={saving}
                                disabled={saving || !dirty || !this.isValid()}
                                onClick={this.save}
                            />
                            <Button
                                size="sm"
                                className="btn--icon"
                                icon="undo"
                                title="Annuler les modifications"
                                aria-label="Annuler les modifications"
                                disabled={saving || !dirty}
                                onClick={this.reset}
                            />
                            <Button
                                variant="danger-ghost"
                                size="sm"
                                className="btn--icon"
                                icon="trash"
                                title="Supprimer"
                                aria-label="Supprimer"
                                disabled={saving}
                                onClick={() => onDelete(edition)}
                            />
                        </span>
                    )}
                </td>
            </tr>
        );
    }
}

export default EditionRow;
