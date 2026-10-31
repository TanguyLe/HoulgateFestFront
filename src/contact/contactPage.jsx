import React from "react";

import ContactForm from "./components/contactForm";
import { PageHeader } from "../ui";

let ContactPage = () => {
    return (
        <div className="contact-page">
            <PageHeader kicker="Bureau des orgas" title="Contact">
                <p>
                    Une question, une suggestion, une réclamation sur la qualité du sable ?
                    Écris-nous, on répond aussi vite qu’un shotgun.
                </p>
            </PageHeader>
            <div className="card card--striped">
                <ContactForm />
            </div>
        </div>
    );
};

export default ContactPage;
