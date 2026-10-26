import React from "react";
import { Button, Dropdown, Form, Message, Modal } from "semantic-ui-react";

// Edits the owner and the roommates of a shotgun. Only the activated users who aren't in another
// shotgun are offered: the back refuses the others.
class ShotgunEditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.shotgun.user ? props.shotgun.user._id : null,
            roommates: props.shotgun.roommates.map((roommate) => roommate._id),
        };
    }

    getOptions(excluded) {
        const { shotgun, shotguns, users } = this.props;
        const busy = new Set(
            shotguns
                .filter((other) => other._id !== shotgun._id)
                .flatMap((other) => [other.user, ...other.roommates])
                .filter(Boolean)
                .map((user) => user._id),
        );

        return users
            .filter((user) => user.activated && !busy.has(user._id) && !excluded.includes(user._id))
            .map((user) => ({ key: user._id, value: user._id, text: user.username || user.email }));
    }

    render() {
        const { shotgun, saving, error, onSave, onClose } = this.props;
        const { user, roommates } = this.state;
        const isPreShotgun = shotgun.status === "preShotgunned";
        const nbBeds = shotgun.room ? shotgun.room.nbBeds : 0;
        const tooMany = 1 + roommates.length > nbBeds;

        return (
            <Modal open size="small" onClose={onClose}>
                <Modal.Header>
                    {(isPreShotgun ? "Pré-shotgun" : "Shotgun") +
                        " de la chambre " +
                        (shotgun.room ? shotgun.room.text : "?")}
                </Modal.Header>
                <Modal.Content>
                    {error && <Message error content={error} />}
                    <Form>
                        <Form.Field>
                            <label>Propriétaire</label>
                            <Dropdown
                                selection
                                search
                                placeholder="Propriétaire"
                                value={user}
                                options={this.getOptions(roommates)}
                                onChange={(event, { value }) => this.setState({ user: value })}
                            />
                        </Form.Field>
                        {isPreShotgun ? (
                            <Message info size="small">
                                Un pré-shotgun n'a pas encore de colocataires : seul le propriétaire
                                peut être changé.
                            </Message>
                        ) : (
                            <Form.Field error={tooMany}>
                                <label>
                                    Colocataires ({1 + roommates.length}/{nbBeds} lits)
                                </label>
                                <Dropdown
                                    selection
                                    search
                                    multiple
                                    placeholder="Colocataires"
                                    value={roommates}
                                    options={this.getOptions([user])}
                                    onChange={(event, { value }) =>
                                        this.setState({ roommates: value })
                                    }
                                />
                            </Form.Field>
                        )}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button content="Annuler" disabled={saving} onClick={onClose} />
                    <Button
                        primary
                        icon="save"
                        content="Enregistrer"
                        loading={saving}
                        disabled={saving || !user || tooMany}
                        onClick={() => onSave({ user: user, roommates: roommates })}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ShotgunEditModal;
