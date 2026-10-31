import React from "react";

import SignUpForm from "./components/forms/signUpForm";
import AccountCard from "./components/accountCard";
import { Button, Notice } from "../ui";

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
        let display;
        if (this.state.status === "registration")
            display = <SignUpForm onRegistration={this.onRegistration} />;
        else if (this.state.status === "registered")
            display = (
                <>
                    <Notice tone="success" title="Merci de t'être inscrit !">
                        Tu devrais avoir reçu un mail pour activer ton compte.
                    </Notice>
                    <div>
                        <Button variant="text" icon="arrowBack" onClick={this.onClickRegister}>
                            Revenir au formulaire
                        </Button>
                    </div>
                </>
            );
        else
            display = (
                <Notice tone="error" title="Il y a eu une erreur lors de ton inscription">
                    Tu nous en vois désolés… N'hésite pas à nous contacter à houlgatefest@gmail.com.
                </Notice>
            );

        return (
            <AccountCard
                title="Inscription"
                intro="Ton compte te servira à shotgun ton lit, voir les trajets et suivre les scores."
            >
                {display}
            </AccountCard>
        );
    }
}

export default SignUpPage;
