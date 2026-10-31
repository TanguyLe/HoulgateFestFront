import React from "react";

import CreatePasswordResetForm from "./components/forms/createPasswordResetForm";
import AccountCard from "./components/accountCard";

const CreatePasswordResetPage = () => (
    <AccountCard
        title="Mot de passe oublié"
        intro="Donne l'email de ton compte, on t'envoie un lien pour en choisir un nouveau."
    >
        <CreatePasswordResetForm />
    </AccountCard>
);

export default CreatePasswordResetPage;
