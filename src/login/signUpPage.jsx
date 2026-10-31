import React from "react";

import SignUpForm from "./components/forms/signUpForm";
import { Notice, PageHeader } from "../ui";

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
                <SignUpForm onRegistration={this.onRegistration} />
            ) : this.state.status === "registered" ? (
                <Notice kind="success" title="Bienvenue à bord !">
                    Merci de t'être inscrit, tu devrais avoir reçu un mail pour activer ton compte!
                    <br /> Pour{" "}
                    <button type="button" className="linklike" onClick={this.onClickRegister}>
                        revenir au formulaire.
                    </button>
                </Notice>
            ) : (
                <Notice kind="error">
                    Il y a eu une erreur lors de ton inscription, tu nous en vois
                    désolés...n'hésites pas à nous contacter à houlgatefest@gmail.com
                </Notice>
            );
        return (
            <div className="signUpPage auth-page">
                <PageHeader kicker="Billet aller simple pour Houlgate" title="Inscription">
                    <p>
                        Un compte par festivalier : c’est lui qui te permettra de shotgun ton lit.
                    </p>
                </PageHeader>
                <div className="card card--striped">{display}</div>
            </div>
        );
    }
}

export default SignUpPage;
