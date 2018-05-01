import React from "react"
import {parse} from "query-string";

import PasswordResetForm from "./forms/PasswordResetForm"
import OnlyWhenConnectedWrapper from "../../utils/login/OnlyWhenConnectedWrapper"
import {getPasswordResetUrl} from "../constants"


class passwordResetPage extends React.Component {
    constructor() {
        super();

        this.state = {status: "form"};

        this.onPasswordChanged = this.onPasswordChanged.bind(this);
    }

    componentWillMount(){
        const parsed = parse(this.props.location.search);

        this.id = parsed.id;
        this.code = parsed.code;

        if (this.id  && this.code)
            this.resetUrl = getPasswordResetUrl(this.id, this.code);
    }

    onPasswordChanged(){
        this.setState({status: "changed"})
    }

    render() {
        let display = "";
        if (this.state.status === "form")
            display = <PasswordResetForm resetUrl={this.resetUrl} onPasswordChanged={this.onPasswordChanged}/>;
        else
            display = "Ton mot de passe a été changé!";

        return(
            <OnlyWhenConnectedWrapper>
                <h1> Changement de Mot de Passe </h1>
                {display}
            </OnlyWhenConnectedWrapper>);
    }
}

export default passwordResetPage
