import React from "react";
import { Button, Segment, TransitionablePortal, Icon, Message } from "semantic-ui-react";

import BedsMultipleDropdown from "./bedsMultipleDropdown";
import { ROOM_STATUS_READY } from "../constants";

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

    // For the owner of a pre-shotgunned or shotgunned room. Confirmed in place: a Confirm modal
    // would be a click outside the portal and close it.
    getCancelButtons(status) {
        if (!this.props.cancelShotgunFunction) return "";
        if (status !== "attributingBeds" && status !== "shotgunSuccessful") return "";

        const what = status === "attributingBeds" ? "pré-shotgun" : "shotgun";

        if (!this.state.confirmingCancel)
            return (
                <Button
                    basic
                    negative
                    compact
                    icon="cancel"
                    content={"Annuler mon " + what}
                    onClick={() => this.setState({ confirmingCancel: true })}
                />
            );

        return (
            <div>
                <p>
                    La chambre et toutes ses personnes seront libérées, et n'importe qui pourra la
                    shotgun. Personne n'est prévenu par email.
                </p>
                <Button
                    negative
                    compact
                    content={"Oui, annuler mon " + what}
                    onClick={() => {
                        this.handleClose();
                        this.props.cancelShotgunFunction();
                    }}
                />
                <Button
                    compact
                    content="Non"
                    onClick={() => this.setState({ confirmingCancel: false })}
                />
            </div>
        );
    }

    getMessage(status) {
        switch (status) {
            case "loading":
                return (
                    <Message info icon>
                        <Icon name="circle notched" loading />
                        <Message.Content>Shotgun en cours...</Message.Content>
                    </Message>
                );
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
                    <Message success>
                        <Message.Content>
                            <p>
                                Félicitations, tu as bien shotgun avec tes amis
                                {this.props.friends
                                    ? "(" + this.props.friends.join(", ") + ")"
                                    : ""}
                                . Réjouis toi de voir ton nom gravé dans le marbre sur ce site. Tu
                                es maitenant responsable si quelqu'un veut échanger :)
                            </p>
                            <p>
                                Si c'est une erreur, la personne qui a shotgun la chambre peut
                                l'annuler, et saches que c'est pas malin!
                            </p>
                        </Message.Content>
                    </Message>
                );
            case "shotgunFailed":
                return (
                    <Message error>
                        <Message.Content>
                            Ton shotgun a échoué :/ Dépêche-toi de tenter une autre chambre!
                        </Message.Content>
                    </Message>
                );
        }
        return "";
    }

    render() {
        const directShotgun = this.props.status === ROOM_STATUS_READY;

        let trigger = (
            <Button
                color={this.props.buttonType}
                compact
                content={this.props.content}
                disabled={this.props.disabled || this.state.open}
                // A controlled TransitionablePortal ignores its own trigger click: open it from here
                onClick={(...args) => {
                    if (directShotgun) this.props.createShotgunFunction(...args);
                    this.handleOpen();
                }}
            />
        );

        return (
            <TransitionablePortal
                open={!this.props.disabled && this.state.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                trigger={trigger}
            >
                <Segment className="ShotgunModal">
                    <h3>
                        {" "}
                        {this.props.name}: {this.props.seats} places{" "}
                    </h3>
                    {this.getMessage(this.props.status)}
                    {this.getCancelButtons(this.props.status)}
                </Segment>
            </TransitionablePortal>
        );
    }
}
