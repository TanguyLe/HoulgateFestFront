import React from "react"
import {Link} from "react-router-dom";

export const NotFound = () => (
    <div>
        <h1>Erreur 404</h1>
        <p>
            Oups jeune chenapan ! Il semble que tu aies perdu ton chemin. Laisse moi te <Link
            to="/">rediriger</Link> vers le côté obscur de la force.
        </p>
    </div>
);

export default NotFound
