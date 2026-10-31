import React from "react";

import { Card, Notice } from "../ui";
import "./trip.css";

// The car shares, on Togetzer
const TripPage = () => (
    <>
        <header className="page-header">
            <h1 className="headline-large">Trajets</h1>
            <p className="body-large on-surface-variant">
                Propose une place dans ta voiture ou trouve quelqu'un pour venir à Houlgate.
            </p>
        </header>
        {process.env.TOGETZER_IFRAME_URL ? (
            <Card variant="outlined" className="trip-card">
                <iframe
                    title="Les trajets sur Togetzer"
                    className="trip-card__frame"
                    src={process.env.TOGETZER_IFRAME_URL}
                />
            </Card>
        ) : (
            <Notice>Les trajets ne sont pas encore ouverts cette année. Reviens plus tard !</Notice>
        )}
    </>
);

export default TripPage;
