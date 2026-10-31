import React from "react";

import CreatePasswordResetForm from "./components/forms/createPasswordResetForm";
import { PageHead } from "../ui";

class CreatePasswordResetPage extends React.Component {
    render() {
        return (
            <div className="createPasswordresetPage">
                <PageHead kicker="Mot de passe oublié ?" title="Changement de Mot de Passe">
                    Entre ton email, on t'envoie un lien pour en choisir un nouveau.
                </PageHead>
                <div className="page-body">
                    <CreatePasswordResetForm />
                </div>
            </div>
        );
    }
}

export default CreatePasswordResetPage;
