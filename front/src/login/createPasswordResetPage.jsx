import React from "react"

import CreatePasswordResetForm from "./components/forms/createPasswordResetForm";
import OnlyWhenConnectedWrapper from "../utils/login/onlyWhenNotConnectedWrapper"

class CreatePasswordResetPage extends React.Component {
    render() {
        return(
            <OnlyWhenConnectedWrapper className="createPasswordresetPage">
                <h1> Changement de Mot de Passe </h1>
                <CreatePasswordResetForm/>
            </OnlyWhenConnectedWrapper>);
    }
}

export default CreatePasswordResetPage
