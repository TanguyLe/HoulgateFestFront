import React from "react";
import withRouter from "../../utils/withRouter";

import LogInForm from "./forms/logInForm";
import { Modal } from "../../ui";
import { onLoginDialog } from "../loginDialog";
import { register, unregister } from "../store";

// The login form in a dialog, opened with openLoginDialog() and closed once logged in
class LoginDialog extends React.Component {
    constructor() {
        super();

        this.state = { open: false };

        this.handleClose = this.handleClose.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount() {
        this.stopListening = onLoginDialog((open) => this.setState({ open }));
        register(this.onLogin);
    }

    componentWillUnmount() {
        this.stopListening();
        unregister(this.onLogin);
    }

    onLogin(creds) {
        if (creds.login) this.handleClose();
    }

    handleClose() {
        this.setState({ open: false });
    }

    render() {
        if (!this.state.open) return null;

        return (
            <Modal
                title={
                    <>
                        Connecte-toi{" "}
                        <span className="emoji" aria-hidden="true">
                            👋
                        </span>
                    </>
                }
                onClose={this.handleClose}
            >
                <LogInForm history={this.props.history} toClose={this.handleClose} />
            </Modal>
        );
    }
}

export default withRouter(LoginDialog);
