import React from "react";

import { Callout, Modal, Spinner } from "../../ui";

const byText = (a, b) => a.text.localeCompare(b.text, "fr", { sensitivity: "base" });

// Edits the owner and the roommates of a shotgun. Only the activated users who aren't in another
// shotgun are offered: the back refuses the others.
class ShotgunEditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.shotgun.user ? props.shotgun.user._id : null,
            roommates: props.shotgun.roommates.map((roommate) => roommate._id),
            search: "",
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
            .sort(byText);
    }

    toggleRoommate(userId) {
        const { roommates } = this.state;
        this.setState({
            roommates: roommates.includes(userId)
                ? roommates.filter((id) => id !== userId)
                : roommates.concat(userId),
        });
    }

    render() {
        const { shotgun, saving, error, onSave, onClose } = this.props;
        const { user, roommates, search } = this.state;
        const isPreShotgun = shotgun.status === "preShotgunned";
        const nbBeds = shotgun.room ? shotgun.room.nbBeds : 0;
        const tooMany = 1 + roommates.length > nbBeds;
        const roommateOptions = this.getOptions([user]).filter(
            (option) =>
                roommates.includes(option.value) ||
                option.text.toLowerCase().includes(search.trim().toLowerCase()),
        );

        return (
            <Modal
                wide
                onClose={onClose}
                title={
                    (isPreShotgun ? "Pré-shotgun" : "Shotgun") +
                    " de la chambre " +
                    (shotgun.room ? shotgun.room.text : "?")
                }
                footer={[
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
                        {saving ? <Spinner /> : "💾"} Enregistrer
                    </button>,
                ]}
            >
                {error && <Callout kind="error">{error}</Callout>}
                <div className="form">
                    <div className="field">
                        <label className="field__label" htmlFor="shotgun-owner">
                            Propriétaire
                        </label>
                        <select
                            id="shotgun-owner"
                            className="select"
                            value={user || ""}
                            onChange={(event) => this.setState({ user: event.target.value })}
                        >
                            <option value="" disabled>
                                Propriétaire
                            </option>
                            {this.getOptions(roommates).map((option) => (
                                <option key={option.key} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    </div>
                    {isPreShotgun ? (
                        <Callout kind="info">
                            Un pré-shotgun n'a pas encore de colocataires : seul le propriétaire
                            peut être changé.
                        </Callout>
                    ) : (
                        <fieldset className="field admin-roommates">
                            <legend className="field__label">
                                Colocataires ({1 + roommates.length}/{nbBeds} lits)
                                {tooMany && <span className="chip chip--taken">Trop de monde</span>}
                            </legend>
                            <input
                                type="search"
                                className="input input--sm"
                                placeholder="Chercher..."
                                aria-label="Chercher un colocataire"
                                value={search}
                                onChange={(event) => this.setState({ search: event.target.value })}
                            />
                            <div className="admin-roommates__list">
                                {roommateOptions.map((option) => (
                                    <label key={option.key} className="admin-roommates__item">
                                        <input
                                            type="checkbox"
                                            checked={roommates.includes(option.value)}
                                            onChange={() => this.toggleRoommate(option.value)}
                                        />
                                        {option.text}
                                    </label>
                                ))}
                                {!roommateOptions.length && (
                                    <span className="muted small">Personne de disponible.</span>
                                )}
                            </div>
                        </fieldset>
                    )}
                </div>
            </Modal>
        );
    }
}

export default ShotgunEditModal;
