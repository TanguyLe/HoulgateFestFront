import React from "react";

import BedsMultipleDropdown from "./bedsMultipleDropdown";
import Icon from "../../ui/icon";
import { Alert, Dialog } from "../../ui/components";

class ShotgunDialog extends React.Component {
    constructor() {
        super();

        this.state = { confirmingCancel: false };
    }

    // For the owner of a pre-shotgunned or shotgunned room. Confirmed in place rather than in a
    // second dialog, which would fight this one over Escape and backdrop clicks.
    renderCancel() {
        const { status, onClose, cancelShotgunFunction } = this.props;
        if (!cancelShotgunFunction) return null;

        const what = status === "attributingBeds" ? "pré-shotgun" : "shotgun";

        if (!this.state.confirmingCancel)
            return (
                <div className="form__actions">
                    <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => this.setState({ confirmingCancel: true })}
                    >
                        <Icon name="x" size={16} />
                        Annuler mon {what}
                    </button>
                </div>
            );

        return (
            <Alert tone="error" title={"Annuler ton " + what + " ?"}>
                <p>
                    La chambre et toutes ses personnes seront libérées, et n'importe qui pourra la
                    shotgun. Personne n'est prévenu par email.
                </p>
                <div className="form__actions">
                    <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => {
                            onClose();
                            cancelShotgunFunction();
                        }}
                    >
                        Oui, annuler mon {what}
                    </button>
                    <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => this.setState({ confirmingCancel: false })}
                    >
                        Non
                    </button>
                </div>
            </Alert>
        );
    }

    render() {
        const { name, seats, status, availablePersons, roommates, onClose } = this.props;

        return (
            <Dialog
                id="shotgunDialog"
                title={name}
                subtitle={seats + " places"}
                onClose={onClose}
                wide={status === "attributingBeds"}
            >
                {status === "attributingBeds" ? (
                    <>
                        <Alert tone="warning" title="La chambre est à toi… pour l’instant !">
                            Choisis vite qui dort avec toi et confirme, sinon la chambre sera
                            libérée.
                        </Alert>
                        <BedsMultipleDropdown
                            numberOfBeds={seats}
                            availablePersons={availablePersons}
                            onSubmit={this.props.addPersonsInShotgunFunction}
                        />
                    </>
                ) : (
                    <Alert tone="success" title="Félicitations, ton shotgun est validé !">
                        <p>
                            {roommates.length
                                ? "Tu dors ici avec " + roommates.join(", ") + ". "
                                : "Tu dors ici. "}
                            Réjouis-toi de voir ton nom gravé dans le marbre sur ce site. Tu es
                            maintenant responsable si quelqu'un veut échanger :)
                        </p>
                        <p>
                            Si c'est une erreur, la personne qui a shotgun la chambre peut
                            l'annuler, et sache que c'est pas malin !
                        </p>
                    </Alert>
                )}
                {this.renderCancel()}
            </Dialog>
        );
    }
}

export default ShotgunDialog;
