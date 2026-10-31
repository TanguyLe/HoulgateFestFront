import React from "react";

import ContactForm from "./components/contactForm";
import { PageHead } from "../ui";

let ContactPage = () => {
    return (
        <div>
            <PageHead kicker="Écrire aux orgas" title="Contact" />
            <div className="page-body">
                <ContactForm />
            </div>
        </div>
    );
};

export default ContactPage;
