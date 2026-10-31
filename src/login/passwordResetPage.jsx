import React from "react";
import withRouter from "../utils/withRouter";

import PasswordResetForm from "./components/forms/passwordResetForm";
import { getPasswordResetUrl } from "./constants";
import { Notice, PageHeader } from "../ui";

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
                <PasswordResetForm
                    resetUrl={this.state.resetUrl}
                    onPasswordChanged={this.onPasswordChanged}
                />
            );
        else display = <Notice kind="success">Ton mot de passe a été changé!</Notice>;

        return (
            <div className="passwordResetPage auth-page">
                <PageHeader kicker="Mon compte" title="Changement de mot de passe" />
                <div className="card card--striped">{display}</div>
            </div>
        );
    }
}

export default withRouter(PasswordResetPage);
