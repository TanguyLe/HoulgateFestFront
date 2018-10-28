import React from "react";
import {
    Button,
    Segment,
    TransitionablePortal,
    Icon,
    Message
} from "semantic-ui-react";

import MultipleDropdown from "../MultipleDropdown";

export default class ShotgunPortal extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.getMessage = this.getMessage.bind(this);
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    getMessage(status) {
        switch (status) {
            case "readyForShotgun":
                return (
                    <Message info icon>
                        <Button
                            content="Shotgun!"
                            onClick={this.props.createShotgunFunction}
                        />
                    </Message>
                );
            case "attributingBeds":
                return (
                    <MultipleDropdown
                        numberOfBeds={this.props.seats}
                        availablePersonsIds={this.props.availablePersonsIds}
                        onSubmit={this.props.addPersonsInShotgunFunction}
                    />
                );

            // case "shotguned":
            //   return (
            //     <MultipleDropdown
            //       numberOfBeds={this.props.seats}
            //       availablePersonsIds={this.props.availablePersonsIds}
            //       onSubmit={this.props.addPersonsInShotgunFunction}
            //     />
            //   );

            case "loading":
                return (
                    <Message info icon>
                        <Icon name="circle notched" loading/>
                        <Message.Content>Shotgun en cours...</Message.Content>
                    </Message>
                );
            case "shotgunSuccessful":
                return (
                    <Message success>
                        <Message.Content>
                            <p>
                                Félicitations, tu as bien shotgun avec tes amis
                                {this.props.friends
                                    ? "(" + this.props.friends.join(", ") + ")"
                                    : ""}. Réjouis toi de voir ton nom gravé dans le marbre sur ce
                                site. Tu est maitenant responsable si quelqu'un veut échanger :)
                            </p>
                            <p>
                                Si c'est une erreur de ta part, pas d'autre solution qu'un petit
                                mail à houlgatefest@gmail.com, et saches que c'est pas malin!
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
        let trigger = (
            <Button compact content="I'm in!" disabled={this.state.open}/>
        );

        if (this.props.disabled) trigger = "";

        return (
            <TransitionablePortal
                open={this.state.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                trigger={trigger}
            >
                <Segment className="ShotgunModal">
                    <h3>
                        {this.props.name}: {this.props.seats} places
                    </h3>
                    {this.getMessage(this.props.status)}
                </Segment>
            </TransitionablePortal>
        );
    }
}
