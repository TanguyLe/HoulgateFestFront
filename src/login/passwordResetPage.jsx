import React from "react";
import withRouter from "../utils/withRouter";

import PasswordResetForm from "./components/forms/passwordResetForm";
import { getPasswordResetUrl } from "./constants";
import AccountCard from "./components/accountCard";
import { Notice } from "../ui";

class PasswordResetPage extends React.Component {
    constructor(props) {
        super(props);

        // Read from the link of the email
        const params = new URLSearchParams(props.location.search);
        this.id = params.get("id");
        this.code = params.get("code");

        this.state = {
            status: "form",
            resetUrl: this.id && this.code ? getPasswordResetUrl(this.id, this.code) : "",
        };

        this.onPasswordChanged = this.onPasswordChanged.bind(this);
    }

    onPasswordChanged() {
        this.setState({ status: "changed" });
    }

    render() {
        return (
            <AccountCard title="Nouveau mot de passe">
                {this.state.status === "form" ? (
                    <PasswordResetForm
                        resetUrl={this.state.resetUrl}
                        onPasswordChanged={this.onPasswordChanged}
                    />
                ) : (
                    <Notice tone="success" title="Ton mot de passe a été changé !">
                        Tu peux te connecter avec ton nouveau mot de passe.
                    </Notice>
                )}
            </AccountCard>
        );
    }
}

export default withRouter(PasswordResetPage);
