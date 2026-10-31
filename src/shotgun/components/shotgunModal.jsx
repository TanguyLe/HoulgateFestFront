import React from "react";

import BedsMultipleDropdown from "./bedsMultipleDropdown";
import Confetti from "./confetti";
import { ROOM_STATUS_LOADING, ROOM_STATUS_READY } from "../constants";
import { Button, Dialog, Notice } from "../../ui";

// Button classes for the colours decided by the room
const BUTTON_VARIANTS = {
    blue: "primary",
    green: "success",
    red: "danger",
    orange: "warn",
    grey: "secondary",
};

export default class ShotgunPortal extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false,
            confirmingCancel: false,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.getMessage = this.getMessage.bind(this);
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false, confirmingCancel: false });
    }

    // For the owner of a pre-shotgunned or shotgunned room, confirmed in place
    getCancelButtons(status) {
        if (!this.props.cancelShotgunFunction) return "";
        if (status !== "attributingBeds" && status !== "shotgunSuccessful") return "";

        const what = status === "attributingBeds" ? "pré-shotgun" : "shotgun";

        if (!this.state.confirmingCancel)
            return (
                <div className="sheet-cancel">
                    <Button
                        variant="danger-ghost"
                        size="sm"
                        icon="close"
                        onClick={() => this.setState({ confirmingCancel: true })}
                    >
                        {"Annuler mon " + what}
                    </Button>
                </div>
            );

        return (
            <div className="sheet-cancel sheet-cancel--confirm">
                <p>
                    La chambre et toutes ses personnes seront libérées, et n'importe qui pourra la
                    shotgun. Personne n'est prévenu par email.
                </p>
                <div className="form__actions">
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                            this.handleClose();
                            this.props.cancelShotgunFunction();
                        }}
                    >
                        {"Oui, annuler mon " + what}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => this.setState({ confirmingCancel: false })}
                    >
                        Non
                    </Button>
                </div>
            </div>
        );
    }

    getMessage(status) {
        switch (status) {
            case "loading":
                return <Notice loading>Shotgun en cours...</Notice>;
            case "attributingBeds":
                return (
                    <>
                        <p className="sheet-lead">
                            Bravo, la chambre est à toi pour l’instant ! Indique qui dort où, puis
                            confirme avant la fin du chrono.
                        </p>
                        <BedsMultipleDropdown
                            numberOfBeds={this.props.seats}
                            availablePersons={this.props.availablePersons}
                            onSubmit={this.props.addPersonsInShotgunFunction}
                        />
                    </>
                );
            case "shotgunSuccessful":
                return (
                    <div className="shotgun-success">
                        <Confetti />
                        <span className="shotgun-success__stamp" aria-hidden="true">
                            Validé
                        </span>
                        <p>
                            Félicitations, tu as bien shotgun avec tes amis
                            {this.props.friends ? "(" + this.props.friends.join(", ") + ")" : ""}.
                            Réjouis toi de voir ton nom gravé dans le marbre sur ce site. Tu es
                            maitenant responsable si quelqu'un veut échanger :)
                        </p>
                        <p className="muted small">
                            Si c'est une erreur, la personne qui a shotgun la chambre peut
                            l'annuler, et saches que c'est pas malin!
                        </p>
                    </div>
                );
            case "shotgunFailed":
                return (
                    <Notice kind="error">
                        Ton shotgun a échoué :/ Dépêche-toi de tenter une autre chambre!
                    </Notice>
                );
            case ROOM_STATUS_READY:
                return (
                    <Notice kind="info">
                        La chambre est libre. Ferme cette fenêtre et retente ta chance !
                    </Notice>
                );
        }
        return "";
    }

    render() {
        const { status, disabled } = this.props;
        const directShotgun = status === ROOM_STATUS_READY;
        const loading = status === ROOM_STATUS_LOADING;

        // Rooms the user can't act on only show their status on the card
        const showTrigger = !disabled || loading;
        // Kept open while loading, so the sheet doesn't blink between the steps
        const open = this.state.open && (!disabled || loading);

        return (
            <>
                {showTrigger && (
                    <Button
                        variant={BUTTON_VARIANTS[this.props.buttonType] || "primary"}
                        className="btn--block"
                        loading={loading}
                        icon={directShotgun ? "sparkle" : undefined}
                        disabled={disabled || open}
                        onClick={(...args) => {
                            if (directShotgun) this.props.createShotgunFunction(...args);
                            this.handleOpen();
                        }}
                    >
                        {this.props.content}
                    </Button>
                )}
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    variant="sheet"
                    className="ShotgunModal"
                    title={this.props.name + " : " + this.props.seats + " places"}
                >
                    {this.getMessage(status)}
                    {this.getCancelButtons(status)}
                </Dialog>
            </>
        );
    }
}
