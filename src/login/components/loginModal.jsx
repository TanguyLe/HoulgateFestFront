import React from "react";
import withRouter from "../../utils/withRouter";
import { Button, Header, Segment, TransitionablePortal } from "semantic-ui-react";

import LogInForm from "./forms/logInForm";

class LoginPortal extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextState === this.state) return 0;
        return 1;
    }

    render() {
        return (
            <TransitionablePortal
                open={this.state.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                // A controlled TransitionablePortal ignores its own trigger click: open it from here
                trigger={
                    <Button
                        content="Connexion"
                        id="loginPortalOpener"
                        disabled={this.state.open}
                        onClick={this.handleOpen}
                    />
                }
            >
                <Segment className="ConnectionModal">
                    <Header id={"loginPortal"}>Connecte-toi</Header>
                    <LogInForm
                        className="loginForm"
                        history={this.props.history}
                        toClose={this.handleClose}
                    />
                </Segment>
            </TransitionablePortal>
        );
    }
}

export default withRouter(LoginPortal);
