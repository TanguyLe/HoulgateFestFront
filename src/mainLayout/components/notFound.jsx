import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => (
    <div className="not-found">
        <div className="not-found__code" aria-hidden>
            404
        </div>
        <h1>Oups, jeune chenapan !</h1>
        <p>
            Il semble que tu aies perdu ton chemin. Laisse-moi te rediriger vers le côté obscur de
            la force.
        </p>
        <Link to="/" className="btn btn--primary btn--lg">
            Retour à l’accueil
        </Link>
    </div>
);

export default NotFound;
