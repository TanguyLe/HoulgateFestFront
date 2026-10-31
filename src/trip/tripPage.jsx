import React from "react";

import { Notice, PageHead } from "../ui";

const TripPage = () => {
    const url = process.env.TOGETZER_IFRAME_URL;

    return (
        <div>
            <PageHead kicker="Covoiturage" title="Trajets">
                Débusquer un trajet en voiture pour venir à Houlgate.
            </PageHead>
            {url ? (
                <div className="frame frame--trips">
                    <div className="frame__bar">
                        <span className="label">Togetzer</span>
                        <a className="label" href={url} target="_blank" rel="noopener noreferrer">
                            Ouvrir ↗
                        </a>
                    </div>
                    <iframe title="Trajets en covoiturage (Togetzer)" src={url}></iframe>
                </div>
            ) : (
                <Notice type="info">
                    Les trajets ne sont pas encore disponibles. Reviens plus tard !
                </Notice>
            )}
        </div>
    );
};

export default TripPage;
