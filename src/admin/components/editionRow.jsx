import React from "react";
import { Button, Input, Label, Table } from "semantic-ui-react";

import { toDateInput, toDatetimeInput, fromDateInput, fromDatetimeInput } from "../adminApi";

const toDraft = (edition) => ({
    year: edition.year !== undefined ? String(edition.year) : "",
    weekendDate: toDateInput(edition.weekendDate),
    shotgunDate: toDatetimeInput(edition.shotgunDate),
});

const fromDraft = (draft) => ({
    year: Number(draft.year),
    weekendDate: fromDateInput(draft.weekendDate),
    shotgunDate: fromDatetimeInput(draft.shotgunDate),
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

    handleChange(event, { name, value }) {
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
        const { year, weekendDate, shotgunDate } = this.state.draft;
        return /^\d{4}$/.test(year) && weekendDate && shotgunDate;
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
            <Table.Row positive={isCurrent} warning={dirty && !isNew}>
                <Table.Cell>
                    <Input
                        name="year"
                        type="number"
                        value={draft.year}
                        onChange={this.handleChange}
                        placeholder="Année"
                        style={{ width: "7em" }}
                    />
                    {isNew && (
                        <Label horizontal style={{ marginLeft: "0.5em" }}>
                            Nouvelle
                        </Label>
                    )}
                    {isCurrent && (
                        <Label color="green" horizontal style={{ marginLeft: "0.5em" }}>
                            En cours
                        </Label>
                    )}
                </Table.Cell>
                <Table.Cell>
                    <Input
                        name="weekendDate"
                        type="date"
                        value={draft.weekendDate}
                        onChange={this.handleChange}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        name="shotgunDate"
                        type="datetime-local"
                        value={draft.shotgunDate}
                        onChange={this.handleChange}
                    />
                </Table.Cell>
                <Table.Cell collapsing textAlign="right">
                    {isNew ? (
                        <Button
                            primary
                            icon="plus"
                            content="Créer"
                            loading={saving}
                            disabled={saving || !this.isValid()}
                            onClick={this.save}
                        />
                    ) : (
                        <Button.Group>
                            <Button
                                primary
                                icon="save"
                                title="Enregistrer"
                                loading={saving}
                                disabled={saving || !dirty || !this.isValid()}
                                onClick={this.save}
                            />
                            <Button
                                icon="undo"
                                title="Annuler les modifications"
                                disabled={saving || !dirty}
                                onClick={this.reset}
                            />
                            <Button
                                negative
                                icon="trash"
                                title="Supprimer"
                                disabled={saving}
                                onClick={() => onDelete(edition)}
                            />
                        </Button.Group>
                    )}
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default EditionRow;
