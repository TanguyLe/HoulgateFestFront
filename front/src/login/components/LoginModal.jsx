import React from "react";
import {Button, Header, Segment, TransitionablePortal} from 'semantic-ui-react'


import LogInForm from "./LogInForm"

export default class TransitionablePortalExamplePortal extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    render() {
        return (
            <TransitionablePortal
                open={this.state.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                trigger={(<Button content="Connection" disabled={this.state.open}/>)}
            >
                <Segment className="connectionModal">
                    <Header>T'es qui toi?!</Header>
                    <LogInForm className="loginForm" toClose={this.handleClose}/>
                </Segment>
            </TransitionablePortal>
        )
    }
}
