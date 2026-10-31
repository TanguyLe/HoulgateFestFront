import React from "react";

import ContactForm from "./components/contactForm";
import { Card } from "../ui";
import "../login/login.css";

const ContactPage = () => (
    <Card variant="outlined" className="account-card">
        <h1 className="headline-small">Contact</h1>
        <p className="body-medium on-surface-variant">
            Une question, un souci avec ton compte ou le shotgun ? Écris aux orgas.
        </p>
        <ContactForm />
    </Card>
);

export default ContactPage;
