import React from "react";

import CreatePasswordResetForm from "./components/forms/createPasswordResetForm";

class CreatePasswordResetPage extends React.Component {
    render() {
        return (
            <div className="createPasswordresetPage">
                <h1> Changement de Mot de Passe </h1>
                <CreatePasswordResetForm />
            </div>
        );
    }
}

export default CreatePasswordResetPage;
