import React from "react";

import Icon from "../../ui/icon";
import { Alert, Dialog } from "../../ui/components";

const userLabel = (user) => user.username || user.email;

// Edits the owner and the roommates of a shotgun. Only the activated users who aren't in another
// shotgun are offered: the back refuses the others.
class ShotgunEditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.shotgun.user ? props.shotgun.user._id : "",
            roommates: props.shotgun.roommates.map((roommate) => roommate._id),
        };

        this.toggleRoommate = this.toggleRoommate.bind(this);
    }

    getCandidates(excluded) {
        const { shotgun, shotguns, users } = this.props;
        const busy = new Set(
            shotguns
                .filter((other) => other._id !== shotgun._id)
                .flatMap((other) => [other.user, ...other.roommates])
                .filter(Boolean)
                .map((user) => user._id),
        );

        return users.filter(
            (user) => user.activated && !busy.has(user._id) && !excluded.includes(user._id),
        );
    }

    toggleRoommate(userId, checked) {
        const roommates = this.state.roommates.filter((id) => id !== userId);
        this.setState({ roommates: checked ? roommates.concat(userId) : roommates });
    }

    render() {
        const { shotgun, saving, error, onSave, onClose } = this.props;
        const { user, roommates } = this.state;
        const isPreShotgun = shotgun.status === "preShotgunned";
        const nbBeds = shotgun.room ? shotgun.room.nbBeds : 0;
        const tooMany = 1 + roommates.length > nbBeds;

        return (
            <Dialog
                id="shotgun-edit"
                title={(isPreShotgun ? "Pré-shotgun" : "Shotgun") + " de la chambre"}
                subtitle={shotgun.room ? shotgun.room.text : "?"}
                onClose={onClose}
            >
                <form
                    className="form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSave({ user: user, roommates: roommates });
                    }}
                >
                    {error && <Alert tone="error">{error}</Alert>}
                    <div className="field">
                        <label className="field__label" htmlFor="shotgun-edit-owner">
                            Propriétaire
                        </label>
                        <select
                            id="shotgun-edit-owner"
                            className="field__control"
                            value={user}
                            onChange={(event) => this.setState({ user: event.target.value })}
                        >
                            {!user && <option value="">Choisir…</option>}
                            {this.getCandidates(roommates).map((candidate) => (
                                <option key={candidate._id} value={candidate._id}>
                                    {userLabel(candidate)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {isPreShotgun ? (
                        <Alert>
                            Un pré-shotgun n’a pas encore de colocataires : seul le propriétaire
                            peut être changé.
                        </Alert>
                    ) : (
                        <fieldset className={"field" + (tooMany ? " field--error" : "")}>
                            <legend className="field__label">
                                Colocataires ({1 + roommates.length}/{nbBeds} lits)
                            </legend>
                            <div className="check-list">
                                {this.getCandidates([user]).map((candidate) => (
                                    <label className="check-list__item" key={candidate._id}>
                                        <input
                                            type="checkbox"
                                            checked={roommates.includes(candidate._id)}
                                            onChange={(event) =>
                                                this.toggleRoommate(
                                                    candidate._id,
                                                    event.target.checked,
                                                )
                                            }
                                        />
                                        {userLabel(candidate)}
                                    </label>
                                ))}
                            </div>
                            {tooMany && (
                                <span className="field__error">
                                    <Icon name="alert" size={14} />
                                    Plus de personnes que de lits.
                                </span>
                            )}
                        </fieldset>
                    )}
                    <div className="form__actions">
                        <button type="button" className="btn" disabled={saving} onClick={onClose}>
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={saving || !user || tooMany}
                        >
                            <Icon name="save" size={16} />
                            {saving ? "Enregistrement…" : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </Dialog>
        );
    }
}

export default ShotgunEditModal;
