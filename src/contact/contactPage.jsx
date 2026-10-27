import React from "react";

import ContactForm from "./components/contactForm";
import { PageHeader } from "../ui/components";

const ContactPage = () => (
    <div>
        <PageHeader title="Écris aux orgas">
            Une question sur le shotgun, un trajet, autre chose ? On te répond vite.
        </PageHeader>
        <div className="card">
            <ContactForm />
        </div>
    </div>
);

export default ContactPage;
