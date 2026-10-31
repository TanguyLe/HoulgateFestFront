import React from "react";
import { Dialog, Field, Notice, Spinner } from "../../ui";

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
            .map((user) => ({ key: user._id, value: user._id, text: user.username || user.email }))
            .sort((a, b) => a.text.localeCompare(b.text, "fr", { sensitivity: "base" }));
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
        const ownerOptions = this.getOptions(roommates);
        // the current owner stays selectable even if the filter would hide it
        const hasOwner = !user || ownerOptions.some((option) => option.value === user);

        return (
            <Dialog
                title={
                    (isPreShotgun ? "Pré-shotgun" : "Shotgun") +
                    " de la chambre " +
                    (shotgun.room ? shotgun.room.text : "?")
                }
                onClose={onClose}
                actions={[
                    <button
                        key="cancel"
                        type="button"
                        className="btn"
                        disabled={saving}
                        onClick={onClose}
                    >
                        Annuler
                    </button>,
                    <button
                        key="save"
                        type="button"
                        className="btn btn--primary"
                        disabled={saving || !user || tooMany}
                        onClick={() => onSave({ user: user, roommates: roommates })}
                    >
                        {saving && <Spinner />} Enregistrer
                    </button>,
                ]}
            >
                <div className="form">
                    {error && <Notice type="error">{error}</Notice>}
                    <Field label="Propriétaire" htmlFor="shotgun-owner">
                        <select
                            id="shotgun-owner"
                            className="input"
                            value={user || ""}
                            onChange={(event) => this.setState({ user: event.target.value })}
                        >
                            <option value="" disabled>
                                Propriétaire
                            </option>
                            {!hasOwner && <option value={user}>{shotgun.user.username}</option>}
                            {ownerOptions.map((option) => (
                                <option key={option.key} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    </Field>
                    {isPreShotgun ? (
                        <Notice type="info">
                            Un pré-shotgun n'a pas encore de colocataires : seul le propriétaire
                            peut être changé.
                        </Notice>
                    ) : (
                        <fieldset className={"roommates" + (tooMany ? " roommates--error" : "")}>
                            <legend className="field__label">
                                Colocataires ({1 + roommates.length}/{nbBeds} lits)
                            </legend>
                            <ul className="roommates__list">
                                {this.getOptions([user]).map((option) => (
                                    <li key={option.key}>
                                        <label className="check">
                                            <input
                                                type="checkbox"
                                                checked={roommates.includes(option.value)}
                                                onChange={(event) =>
                                                    this.toggleRoommate(
                                                        option.value,
                                                        event.target.checked,
                                                    )
                                                }
                                            />
                                            <span>{option.text}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </fieldset>
                    )}
                </div>
            </Dialog>
        );
    }
}

export default ShotgunEditModal;
