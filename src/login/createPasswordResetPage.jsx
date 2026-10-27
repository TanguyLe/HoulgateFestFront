import React from "react";

import CreatePasswordResetForm from "./components/forms/createPasswordResetForm";
import { PageHeader } from "../ui/components";

const CreatePasswordResetPage = () => (
    <div className="createPasswordresetPage">
        <PageHeader title="Mot de passe oublié">
            Donne-nous ton email, on t’envoie un lien pour en choisir un nouveau.
        </PageHeader>
        <div className="card">
            <CreatePasswordResetForm />
        </div>
    </div>
);

export default CreatePasswordResetPage;
