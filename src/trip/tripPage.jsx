import React from "react";

import { Notice, PageHeader } from "../ui";

const TripPage = () => {
    return (
        <div className="trip-page">
            <PageHeader kicker="Tous en voiture" title="Trajets">
                <p>
                    Débusque un trajet en voiture vers Houlgate, ou propose tes places libres : le
                    covoiturage, c’est déjà un peu la fête.
                </p>
            </PageHeader>
            {process.env.TOGETZER_IFRAME_URL ? (
                <div className="frame frame--widget">
                    <iframe
                        title="Trajets en covoiturage"
                        className="frame__iframe frame__iframe--togetzer"
                        src={process.env.TOGETZER_IFRAME_URL}
                    ></iframe>
                </div>
            ) : (
                <Notice kind="info">
                    Le module de covoiturage n'est pas disponible pour l'instant.
                </Notice>
            )}
        </div>
    );
};

export default TripPage;
