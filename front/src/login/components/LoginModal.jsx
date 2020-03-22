import React from "react";
import {withRouter} from 'react-router-dom';
import {Button, Header, Segment, TransitionablePortal} from 'semantic-ui-react'


import LogInForm from "./forms/LogInForm"

class LoginPortal extends React.Component {
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
                trigger={(<Button content="Connexion" disabled={this.state.open}/>)}
            >
                <Segment className="ConnectionModal">
                    <Header>Connecte-toi</Header>
                    <LogInForm className="loginForm" history={this.props.history} toClose={this.handleClose}/>
                </Segment>
            </TransitionablePortal>
        );
    }
}

export default withRouter(LoginPortal);
