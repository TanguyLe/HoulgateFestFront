import React from "react"

import SignUpForm from "./components/forms/signUpForm"

class SignUpPage extends React.Component {
    constructor() {
        super();

        this.state = {status: "registration"};

        this.onRegistration = this.onRegistration.bind(this);
        this.onClickRegister = this.onClickRegister.bind(this);
    }

    onRegistration(regStatus) {
        this.setState({status: regStatus});
    }

    onClickRegister() {
        this.setState({status: "registration"});
    }

    render() {
        let display = this.state.status === "registration" ? <SignUpForm onRegistration={this.onRegistration}/> :
                      this.state.status === "registered"?
                          <div>Merci de t'être inscrit, tu devrais avoir reçu un mail pour activer ton compte!
                              <br/> Pour <a onClick={this.onClickRegister}> revenir au formulaire.</a>
                          </div>
                          :
                          "Il y a eu une erreur lors de ton inscription, tu nous en vois désolés...n'hésites pas à nous contacter à houlgatefest@gmail.com";
        return(
            <div className="signUpPage">
                <h1> Inscription </h1>
                {display}
            </div>);
    }
}

export default SignUpPage
