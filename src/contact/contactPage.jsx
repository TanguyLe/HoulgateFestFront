import React from "react";

import ContactForm from "./components/contactForm";

let ContactPage = () => {
    return (
        <div className="narrow">
            <header className="page-header">
                <span className="sticker sticker--blue" style={{ "--tilt": "-3deg" }}>
                    On répond vite (promis)
                </span>
                <h1>
                    Contact{" "}
                    <span className="emoji" aria-hidden="true">
                        💌
                    </span>
                </h1>
                <p>Une question, une idée de thème, un duo à proposer ? Écris-nous !</p>
            </header>
            <section className="card">
                <ContactForm />
            </section>
        </div>
    );
};

export default ContactPage;
