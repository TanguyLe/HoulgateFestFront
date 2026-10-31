import React from "react";
import { Link } from "react-router-dom";

import { btnClass } from "../../ui";

export const NotFound = () => (
    <div className="not-found">
        <div className="not-found__buoy" aria-hidden="true">
            404
        </div>
        <span className="kicker">Perdu en mer</span>
        <h1>Erreur 404</h1>
        <p className="lead">
            Oups jeune chenapan ! Il semble que tu aies perdu ton chemin. Laisse moi te{" "}
            <Link to="/">rediriger</Link> vers le côté obscur de la force.
        </p>
        <Link to="/" className={btnClass("primary")}>
            Retour au port
        </Link>
    </div>
);

export default NotFound;
