import React from "react";

import { Button } from "../../ui";

export const NotFound = () => (
    <section className="page-header not-found">
        <p className="display-large emphasized on-surface-variant">404</p>
        <h1 className="headline-medium">Oups jeune chenapan !</h1>
        <p className="body-large">
            Il semble que tu aies perdu ton chemin. Laisse-moi te rediriger vers le côté obscur de
            la force.
        </p>
        <div>
            <Button to="/" icon="home">
                Retour à l'accueil
            </Button>
        </div>
    </section>
);

export default NotFound;
