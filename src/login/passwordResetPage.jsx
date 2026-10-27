import React from "react";
import withRouter from "../utils/withRouter";

import PasswordResetForm from "./components/forms/passwordResetForm";
import { getPasswordResetUrl } from "./constants";
import { Alert, PageHeader } from "../ui/components";

class PasswordResetPage extends React.Component {
    constructor() {
        super();

        this.state = { status: "form", resetUrl: "" };

        this.onPasswordChanged = this.onPasswordChanged.bind(this);
    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);

        this.id = params.get("id");
        this.code = params.get("code");

        if (this.id && this.code)
            this.setState({ resetUrl: getPasswordResetUrl(this.id, this.code) });
    }

    onPasswordChanged() {
        this.setState({ status: "changed" });
    }

    render() {
        let display;
        if (this.state.status === "form")
            display = (
                <div className="card">
                    <PasswordResetForm
                        resetUrl={this.state.resetUrl}
                        onPasswordChanged={this.onPasswordChanged}
                    />
                </div>
            );
        else
            display = (
                <Alert tone="success" title="C’est fait !">
                    Ton mot de passe a été changé, tu peux te connecter.
                </Alert>
            );

        return (
            <div className="passwordResetPage">
                <PageHeader title="Nouveau mot de passe" />
                {display}
            </div>
        );
    }
}

export default withRouter(PasswordResetPage);
