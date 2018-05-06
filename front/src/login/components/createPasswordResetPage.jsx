import React from "react"

import CreatePasswordResetForm from "./forms/CreatePasswordResetForm";
import OnlyWhenConnectedWrapper from "../../utils/login/OnlyWhenConnectedWrapper"

class createPasswordResetPage extends React.Component {
    render() {
        return(
            <OnlyWhenConnectedWrapper>
                <h1> Changement de Mot de Passe </h1>
                <CreatePasswordResetForm/>
            </OnlyWhenConnectedWrapper>);
    }
}

export default createPasswordResetPage
