import React from "react";

import SignUpForm from "./components/forms/signUpForm";
import { Alert, PageHeader } from "../ui/components";

class SignUpPage extends React.Component {
    constructor() {
        super();

        this.state = { status: "registration" };

        this.onRegistration = this.onRegistration.bind(this);
        this.onClickRegister = this.onClickRegister.bind(this);
    }

    onRegistration(regStatus) {
        this.setState({ status: regStatus });
    }

    onClickRegister() {
        this.setState({ status: "registration" });
    }

    render() {
        let display =
            this.state.status === "registration" ? (
                <div className="card">
                    <SignUpForm onRegistration={this.onRegistration} />
                </div>
            ) : this.state.status === "registered" ? (
                <Alert tone="success" title="Bienvenue dans la bande !">
                    Merci de t'être inscrit, tu devrais avoir reçu un mail pour activer ton compte.{" "}
                    <a onClick={this.onClickRegister}>Revenir au formulaire</a>
                </Alert>
            ) : (
                <Alert tone="error" title="Inscription impossible">
                    Il y a eu une erreur lors de ton inscription, tu nous en vois désolés… N'hésite
                    pas à nous contacter à houlgatefest@gmail.com
                </Alert>
            );

        return (
            <div className="signUpPage">
                <PageHeader title="Inscription">
                    Un compte suffit pour shotgun ton lit, trouver un trajet et suivre les scores.
                </PageHeader>
                {display}
            </div>
        );
    }
}

export default SignUpPage;
