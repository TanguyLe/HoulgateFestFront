import React from "react";

import BedsMultipleDropdown from "./bedsMultipleDropdown";
import Confetti from "./confetti";
import { ROOM_STATUS_READY } from "../constants";
import { Dialog, Loading, Notice, cx } from "../../ui";

const BUTTON_CLASSES = {
    blue: "btn--accent",
    green: "btn--ok",
    red: "btn--danger",
    orange: "",
    grey: "",
};

export default class ShotgunPortal extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false,
            confirmingCancel: false,
            celebrate: false,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.getMessage = this.getMessage.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { status } = this.props;
        if (!this.state.open || prevProps.status === status) return;

        // the shotgun just went through while the sheet is open: party time
        if (status === "shotgunSuccessful") this.setState({ celebrate: true });
        // the room is free again (the shotgun was denied or cancelled): nothing left to show
        if (status === ROOM_STATUS_READY) this.handleClose();
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false, confirmingCancel: false, celebrate: false });
    }

    // For the owner of a pre-shotgunned or shotgunned room. Confirmed in place, inside the sheet.
    getCancelButtons(status) {
        if (!this.props.cancelShotgunFunction) return "";
        if (status !== "attributingBeds" && status !== "shotgunSuccessful") return "";

        const what = status === "attributingBeds" ? "pré-shotgun" : "shotgun";

        if (!this.state.confirmingCancel)
            return (
                <div className="sheet__cancel">
                    <button
                        type="button"
                        className="btn btn--small btn--ghost"
                        onClick={() => this.setState({ confirmingCancel: true })}
                    >
                        Annuler mon {what}
                    </button>
                </div>
            );

        return (
            <div className="sheet__cancel sheet__cancel--confirm">
                <p>
                    La chambre et toutes ses personnes seront libérées, et n'importe qui pourra la
                    shotgun. Personne n'est prévenu par email.
                </p>
                <div className="btn-row">
                    <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => {
                            this.handleClose();
                            this.props.cancelShotgunFunction();
                        }}
                    >
                        Oui, annuler mon {what}
                    </button>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => this.setState({ confirmingCancel: false })}
                    >
                        Non
                    </button>
                </div>
            </div>
        );
    }

    getMessage(status) {
        switch (status) {
            case "loading":
                return <Loading>Shotgun en cours...</Loading>;
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
                    <div className="sheet__success">
                        <p className="sheet__bang display">C'est dans la poche !</p>
                        <p>
                            Félicitations, tu as bien shotgun avec tes amis
                            {this.props.friends ? "(" + this.props.friends.join(", ") + ")" : ""}.
                            Réjouis toi de voir ton nom gravé dans le marbre sur ce site. Tu es
                            maitenant responsable si quelqu'un veut échanger :)
                        </p>
                        <p>
                            Si c'est une erreur, la personne qui a shotgun la chambre peut
                            l'annuler, et saches que c'est pas malin!
                        </p>
                    </div>
                );
            case "shotgunFailed":
                return (
                    <Notice type="error">
                        Ton shotgun a échoué :/ Dépêche-toi de tenter une autre chambre!
                    </Notice>
                );
        }
        return "";
    }

    render() {
        const directShotgun = this.props.status === ROOM_STATUS_READY;
        const open = !this.props.disabled && this.state.open;

        return (
            <>
                <button
                    type="button"
                    className={cx(
                        "btn btn--block room__cta",
                        BUTTON_CLASSES[this.props.buttonType],
                    )}
                    disabled={this.props.disabled || open}
                    onClick={(...args) => {
                        if (directShotgun) this.props.createShotgunFunction(...args);
                        this.handleOpen();
                    }}
                >
                    {this.props.content}
                </button>
                {open && (
                    <Dialog
                        title={this.props.name + " : " + this.props.seats + " places"}
                        onClose={this.handleClose}
                        className={cx(
                            "sheet",
                            this.props.status === "shotgunSuccessful" && "sheet--success",
                        )}
                    >
                        {this.getMessage(this.props.status)}
                        {this.getCancelButtons(this.props.status)}
                    </Dialog>
                )}
                {open && this.state.celebrate && <Confetti />}
            </>
        );
    }
}
