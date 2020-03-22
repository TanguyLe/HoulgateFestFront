import React from "react"

import CreatePasswordResetForm from "./forms/CreatePasswordResetForm";
import OnlyWhenConnectedWrapper from "../../utils/login/OnlyWhenNotConnectedWrapper"

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
