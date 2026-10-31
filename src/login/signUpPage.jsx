import React from "react";

import SignUpForm from "./components/forms/signUpForm";
import AuthCard from "./components/authCard";
import { Callout } from "../ui";

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
                <Callout kind="success" icon="📬" title="Bienvenue dans la bande !">
                    <p>
                        Merci de t'être inscrit, tu devrais avoir reçu un mail pour activer ton
                        compte!
                    </p>
                    <p>
                        Pour{" "}
                        <button type="button" className="link-btn" onClick={this.onClickRegister}>
                            revenir au formulaire.
                        </button>
                    </p>
                </Callout>
            ) : (
                <Callout kind="error">
                    Il y a eu une erreur lors de ton inscription, tu nous en vois
                    désolés...n'hésites pas à nous contacter à houlgatefest@gmail.com
                </Callout>
            );
        return (
            <AuthCard
                emoji="✍️"
                title="Inscription"
                intro="Crée ton compte pour participer au shotgun des chambres. Pense à activer ton compte avec le mail que tu vas recevoir !"
            >
                {display}
            </AuthCard>
        );
    }
}

export default SignUpPage;
