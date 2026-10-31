import React from "react";

import { Button, Dialog, InputChip, Notice, Select } from "../../ui";

// Edits the owner and the roommates of a shotgun. Only the activated users who aren't in another
// shotgun are offered: the back refuses the others.
class ShotgunEditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.shotgun.user ? props.shotgun.user._id : "",
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
            .map((user) => ({ value: user._id, label: user.username || user.email }));
    }

    getName(userId) {
        const user = this.props.users.find((user) => user._id === userId);
        return user ? user.username || user.email : "?";
    }

    render() {
        const { shotgun, saving, error, onSave, onClose } = this.props;
        const { user, roommates } = this.state;
        const isPreShotgun = shotgun.status === "preShotgunned";
        const nbBeds = shotgun.room ? shotgun.room.nbBeds : 0;
        const tooMany = 1 + roommates.length > nbBeds;

        return (
            <Dialog
                open
                onClose={onClose}
                title={
                    (isPreShotgun ? "Pré-shotgun" : "Shotgun") +
                    " de la chambre " +
                    (shotgun.room ? shotgun.room.text : "?")
                }
                actions={
                    <>
                        <Button variant="text" disabled={saving} onClick={onClose}>
                            Annuler
                        </Button>
                        <Button
                            icon="save"
                            loading={saving}
                            disabled={!user || tooMany}
                            onClick={() => onSave({ user: user, roommates: roommates })}
                        >
                            Enregistrer
                        </Button>
                    </>
                }
            >
                {error && <Notice tone="error">{error}</Notice>}
                <div className="form">
                    <Select
                        label="Propriétaire"
                        placeholder={user ? undefined : "Choisir"}
                        value={user}
                        options={this.getOptions(roommates)}
                        onChange={(event) => this.setState({ user: event.target.value })}
                    />
                    {isPreShotgun ? (
                        <Notice>
                            Un pré-shotgun n'a pas encore de colocataires : seul le propriétaire
                            peut être changé.
                        </Notice>
                    ) : (
                        <fieldset className="roommates-field">
                            <legend className="title-small">
                                Colocataires ({1 + roommates.length}/{nbBeds} lits)
                            </legend>
                            <div className="roommates-field__chips">
                                {roommates.length ? (
                                    roommates.map((roommateId) => (
                                        <InputChip
                                            key={roommateId}
                                            removeLabel={"Retirer " + this.getName(roommateId)}
                                            onRemove={() =>
                                                this.setState({
                                                    roommates: roommates.filter(
                                                        (id) => id !== roommateId,
                                                    ),
                                                })
                                            }
                                        >
                                            {this.getName(roommateId)}
                                        </InputChip>
                                    ))
                                ) : (
                                    <span className="body-medium">Aucun</span>
                                )}
                            </div>
                            <Select
                                label="Ajouter un colocataire"
                                placeholder="Choisir"
                                value=""
                                options={this.getOptions([user, ...roommates])}
                                error={tooMany ? "Plus de personnes que de lits." : ""}
                                onChange={(event) =>
                                    event.target.value &&
                                    this.setState({ roommates: [...roommates, event.target.value] })
                                }
                            />
                        </fieldset>
                    )}
                </div>
            </Dialog>
        );
    }
}

export default ShotgunEditModal;
