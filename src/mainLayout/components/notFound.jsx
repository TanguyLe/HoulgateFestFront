import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => (
    <section className="card not-found">
        <p className="not-found__code" aria-hidden="true">
            <span>4</span>
            <span className="emoji">🏖️</span>
            <span>4</span>
        </p>
        <h1 className="not-found__title">Erreur 404</h1>
        <p>
            Oups jeune chenapan ! Il semble que tu aies perdu ton chemin. Laisse moi te{" "}
            <Link to="/">rediriger</Link> vers le côté obscur de la force.
        </p>
        <Link to="/" className="btn btn--primary">
            Retour à l'accueil
        </Link>
    </section>
);

export default NotFound;
