import React from "react";

import CreatePasswordResetForm from "./components/forms/createPasswordResetForm";
import AuthCard from "./components/authCard";

class CreatePasswordResetPage extends React.Component {
    render() {
        return (
            <AuthCard
                emoji="🤫"
                title="Mot de passe oublié ?"
                intro="Ça arrive aux meilleurs. Donne-nous ton email, on t'envoie un lien pour en choisir un nouveau."
            >
                <CreatePasswordResetForm />
            </AuthCard>
        );
    }
}

export default CreatePasswordResetPage;
