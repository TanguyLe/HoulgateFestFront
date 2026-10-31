import React from "react";

// The frame of the account pages (sign up, activation, password reset)
const AuthCard = ({ emoji, title, intro, children }) => (
    <section className="card auth-card">
        <div className="auth-card__badge emoji" aria-hidden="true">
            {emoji}
        </div>
        <h1 className="auth-card__title">{title}</h1>
        {intro && <p className="auth-card__intro">{intro}</p>}
        {children}
    </section>
);

export default AuthCard;
