import React from "react";

import BedsMultipleDropdown from "./bedsMultipleDropdown";
import { ROOM_STATUS_READY } from "../constants";
import { Callout, Confetti, Loading, Modal } from "../../ui";

// The colors of the room's button, named after the former Semantic UI ones
const BUTTON_CLASSES = {
    blue: "btn--primary",
    green: "btn--success",
    red: "btn--danger",
    orange: "btn--pending",
    grey: "",
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

    // For the owner of a pre-shotgunned or shotgunned room. Confirmed in place, within the dialog.
    getCancelButtons(status) {
        if (!this.props.cancelShotgunFunction) return "";
        if (status !== "attributingBeds" && status !== "shotgunSuccessful") return "";

        const what = status === "attributingBeds" ? "pré-shotgun" : "shotgun";

        if (!this.state.confirmingCancel)
            return (
                <div className="shotgun-sheet__cancel">
                    <button
                        type="button"
                        className="btn btn--sm btn--soft-danger"
                        onClick={() => this.setState({ confirmingCancel: true })}
                    >
                        {"Annuler mon " + what}
                    </button>
                </div>
            );

        return (
            <div className="shotgun-sheet__cancel">
                <Callout kind="warning" icon="🤔" title="Sûr·e de toi ?">
                    <p>
                        La chambre et toutes ses personnes seront libérées, et n'importe qui pourra
                        la shotgun. Personne n'est prévenu par email.
                    </p>
                    <div className="row">
                        <button
                            type="button"
                            className="btn btn--sm btn--danger"
                            onClick={() => {
                                this.handleClose();
                                this.props.cancelShotgunFunction();
                            }}
                        >
                            {"Oui, annuler mon " + what}
                        </button>
                        <button
                            type="button"
                            className="btn btn--sm"
                            onClick={() => this.setState({ confirmingCancel: false })}
                        >
                            Non
                        </button>
                    </div>
                </Callout>
            </div>
        );
    }

    getMessage(status) {
        switch (status) {
            case "loading":
                return <Loading emoji="🏃">Shotgun en cours...</Loading>;
            case "attributingBeds":
                return (
                    <BedsMultipleDropdown
                        numberOfBeds={this.props.seats}
                        availablePersons={this.props.availablePersons}
                        onSubmit={this.props.addPersonsInShotgunFunction}
                    />
                );
            case "shotgunSuccessful":
                return (
                    <div className="shotgun-success">
                        <Confetti />
                        <div className="shotgun-success__badge emoji" aria-hidden="true">
                            🎉
                        </div>
                        <p className="shotgun-success__title">Shotgun réussi !</p>
                        <p>
                            Félicitations, tu as bien shotgun avec tes amis
                            {this.props.friends ? "(" + this.props.friends.join(", ") + ")" : ""}.
                            Réjouis toi de voir ton nom gravé dans le marbre sur ce site. Tu es
                            maitenant responsable si quelqu'un veut échanger :)
                        </p>
                        <p className="small muted">
                            Si c'est une erreur, la personne qui a shotgun la chambre peut
                            l'annuler, et saches que c'est pas malin!
                        </p>
                    </div>
                );
            case "shotgunFailed":
                return (
                    <Callout kind="error">
                        Ton shotgun a échoué :/ Dépêche-toi de tenter une autre chambre!
                    </Callout>
                );
        }
        // Nothing to do here anymore (e.g. the shotgun was denied)
        return (
            <div className="row">
                <button type="button" className="btn" onClick={this.handleClose}>
                    Retour aux chambres
                </button>
            </div>
        );
    }

    render() {
        const directShotgun = this.props.status === ROOM_STATUS_READY;
        const open = !this.props.disabled && this.state.open;

        return (
            <>
                <button
                    type="button"
                    className={
                        "btn btn--block room-card__action " +
                        (BUTTON_CLASSES[this.props.buttonType] || "")
                    }
                    disabled={this.props.disabled || this.state.open}
                    onClick={(...args) => {
                        if (directShotgun) this.props.createShotgunFunction(...args);
                        this.handleOpen();
                    }}
                >
                    {this.props.content}
                </button>
                {open && (
                    <Modal
                        title={
                            <>
                                {this.props.name}{" "}
                                <span className="chip chip--plain">{this.props.seats} places</span>
                            </>
                        }
                        onClose={this.handleClose}
                    >
                        <div className="shotgun-sheet">
                            {this.getMessage(this.props.status)}
                            {this.getCancelButtons(this.props.status)}
                        </div>
                    </Modal>
                )}
            </>
        );
    }
}
