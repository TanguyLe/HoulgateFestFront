import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => (
    <section className="not-found">
        <p className="label">Erreur — page introuvable</p>
        <h1 className="not-found__code">404</h1>
        <p className="not-found__text">
            Oups jeune chenapan ! Il semble que tu aies perdu ton chemin. Laisse moi te{" "}
            <Link to="/">rediriger</Link> vers le côté obscur de la force.
        </p>
        <Link to="/" className="btn btn--accent">
            Retour à l'accueil
        </Link>
    </section>
);

export default NotFound;
