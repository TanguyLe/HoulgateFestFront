import React from "react";

import CreatePasswordResetForm from "./components/forms/createPasswordResetForm";
import { PageHeader } from "../ui";

class CreatePasswordResetPage extends React.Component {
    render() {
        return (
            <div className="createPasswordresetPage auth-page">
                <PageHeader kicker="Mon compte" title="Mot de passe oublié ?">
                    <p>Ça arrive aux meilleurs. Donne-nous ton email, on t’envoie un lien.</p>
                </PageHeader>
                <div className="card card--striped">
                    <CreatePasswordResetForm />
                </div>
            </div>
        );
    }
}

export default CreatePasswordResetPage;
