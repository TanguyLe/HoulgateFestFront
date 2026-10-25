import React from "react";
import withRouter from "../../utils/withRouter";

import LogInForm from "./forms/logInForm";
import { Dialog } from "../../ui/components";

class LoginPortal extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
    }

    handleClose() {
        this.setState({ open: false });
    }

    render() {
        return (
            <>
                {/* The id is used by OnlyWhenConnectedWrapper to open the dialog from a page */}
                <button
                    type="button"
                    className="btn btn--dark btn--sm"
                    id="loginPortalOpener"
                    onClick={this.handleToggle}
                >
                    Connexion
                </button>
                {this.state.open && (
                    <Dialog
                        id="loginPortal"
                        title="Connecte-toi"
                        subtitle="Pour shotgun ta chambre et accéder à tout le site."
                        onClose={this.handleClose}
                    >
                        <LogInForm history={this.props.history} toClose={this.handleClose} />
                    </Dialog>
                )}
            </>
        );
    }
}

export default withRouter(LoginPortal);
