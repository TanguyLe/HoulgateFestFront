import React from "react"
import {parse} from "query-string";
import {withRouter} from "react-router-dom";

import PasswordResetForm from "./components/forms/passwordResetForm"
import OnlyWhenConnectedWrapper from "../utils/login/onlyWhenNotConnectedWrapper"
import {getPasswordResetUrl} from "./constants"


class PasswordResetPage extends React.Component {
    constructor() {
        super();

        this.state = {status: "form", resetUrl: ''};

        this.onPasswordChanged = this.onPasswordChanged.bind(this);
    }

    componentDidMount(){
        const parsed = parse(this.props.location.search);

        this.id = parsed.id;
        this.code = parsed.code;

        if (this.id  && this.code)
            this.setState({"resetUrl": getPasswordResetUrl(this.id, this.code)});
    }

    onPasswordChanged(){
        this.setState({status: "changed"})
    }

    render() {
        let display = "";
        if (this.state.status === "form")
            display = <PasswordResetForm resetUrl={this.state.resetUrl} onPasswordChanged={this.onPasswordChanged}/>;
        else
            display = "Ton mot de passe a été changé!";

        return(
            <OnlyWhenConnectedWrapper className="passwordResetPage">
                <h1> Changement de Mot de Passe </h1>
                {display}
            </OnlyWhenConnectedWrapper>);
    }
}

export default withRouter(PasswordResetPage);
