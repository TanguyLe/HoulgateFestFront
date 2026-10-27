import React from "react";

import ContactForm from "./components/contactForm";
import { PageHeader } from "../ui/components";

const ContactPage = () => (
    <div>
        <PageHeader title="Écris aux orgas">
            Un souci de shotgun, une idée de défi ou une déclaration d’amour : on lit tout.
        </PageHeader>
        <div className="card">
            <ContactForm />
        </div>
    </div>
);

export default ContactPage;
