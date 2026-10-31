import React from "react";

import { Button, Dialog, Notice } from "../../ui";

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

        const ownerOptions = this.getOptions(roommates);
        const query = search.trim().toLowerCase();
        // the selected roommates stay listed whatever the search
        const roommateOptions = this.getOptions([user]).filter(
            (option) =>
                !query ||
                roommates.includes(option.value) ||
                option.text.toLowerCase().includes(query),
        );

        return (
            <Dialog
                open
                onClose={onClose}
                title={
                    (isPreShotgun ? "Pré-shotgun" : "Shotgun") +
                    " de la chambre " +
                    (shotgun.room ? shotgun.room.text : "?")
                }
                footer={
                    <>
                        <Button variant="ghost" disabled={saving} onClick={onClose}>
                            Annuler
                        </Button>
                        <Button
                            variant="primary"
                            icon="save"
                            loading={saving}
                            disabled={saving || !user || tooMany}
                            onClick={() => onSave({ user: user, roommates: roommates })}
                        >
                            Enregistrer
                        </Button>
                    </>
                }
            >
                {error && <Notice kind="error">{error}</Notice>}
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
                            {ownerOptions.map((option) => (
                                <option key={option.key} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    </div>
                    {isPreShotgun ? (
                        <Notice kind="info">
                            Un pré-shotgun n'a pas encore de colocataires : seul le propriétaire
                            peut être changé.
                        </Notice>
                    ) : (
                        <fieldset className={"field" + (tooMany ? " field--error" : "")}>
                            <legend className="field__label">
                                Colocataires ({1 + roommates.length}/{nbBeds} lits)
                            </legend>
                            <input
                                className="field__input"
                                type="search"
                                placeholder="Rechercher..."
                                aria-label="Rechercher un colocataire"
                                value={search}
                                onChange={(event) => this.setState({ search: event.target.value })}
                            />
                            <div className="chips">
                                {roommateOptions.map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className="chip"
                                        aria-pressed={roommates.includes(option.value)}
                                        onClick={() => this.toggleRoommate(option.value)}
                                    >
                                        {option.text}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    )}
                </div>
            </Dialog>
        );
    }
}

export default ShotgunEditModal;
