import React from "react";
import withRouter from "../../utils/withRouter";

import LogInForm from "./forms/logInForm";
import { Dialog } from "../../ui";
import Icon from "../../ui/icons";
import { subscribeLoginPanel } from "../loginPanel";

class LoginPortal extends React.Component {
    constructor() {
        super();

        this.state = { open: false };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = subscribeLoginPanel((open) => this.setState({ open: open }));
    }

    componentDidUpdate(prevProps) {
        // leaving the page closes the dialog
        if (prevProps.location.pathname !== this.props.location.pathname && this.state.open)
            this.handleClose();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false });
    }

    render() {
        return (
            <>
                <button
                    type="button"
                    className={"btn btn--accent account__login " + (this.props.className || "")}
                    id="loginPortalOpener"
                    onClick={this.handleOpen}
                >
                    <Icon name="user" size={18} />
                    <span>Connexion</span>
                </button>
                {this.state.open && (
                    <Dialog title="Connecte-toi" onClose={this.handleClose}>
                        <LogInForm history={this.props.history} toClose={this.handleClose} />
                    </Dialog>
                )}
            </>
        );
    }
}

export default withRouter(LoginPortal);
