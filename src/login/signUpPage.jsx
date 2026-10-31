import React from "react";

import SignUpForm from "./components/forms/signUpForm";
import { Notice, PageHead } from "../ui";

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
                <Notice type="success" title="Bienvenue !">
                    Merci de t'être inscrit, tu devrais avoir reçu un mail pour activer ton compte!
                    <br /> Pour{" "}
                    <button type="button" className="linkish" onClick={this.onClickRegister}>
                        revenir au formulaire.
                    </button>
                </Notice>
            ) : (
                <Notice type="error">
                    Il y a eu une erreur lors de ton inscription, tu nous en vois
                    désolés...n'hésites pas à nous contacter à houlgatefest@gmail.com
                </Notice>
            );
        return (
            <div className="signUpPage">
                <PageHead kicker="Étape 1 avant le shotgun" title="Inscription">
                    Crée ton compte bien avant le jour J, et vérifie que tu peux te connecter.
                </PageHead>
                <div className="page-body">{display}</div>
            </div>
        );
    }
}

export default SignUpPage;
