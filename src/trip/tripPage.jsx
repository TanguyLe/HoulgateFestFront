import React from "react";

import { Callout } from "../ui";

const TripPage = () => {
    return (
        <div>
            <header className="page-header">
                <span className="sticker sticker--blue" style={{ "--tilt": "-3deg" }}>
                    Covoiturage
                </span>
                <h1>
                    Trajets{" "}
                    <span className="emoji" aria-hidden="true">
                        🚗
                    </span>
                </h1>
                <p>
                    Une place dans ta voiture, ou besoin d'une ? Organisez-vous pour venir à
                    Houlgate !
                </p>
            </header>
            {process.env.TOGETZER_IFRAME_URL ? (
                <div className="frame frame--trips">
                    <div className="frame__bar">
                        <span className="frame__dots" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                        </span>
                        <span className="frame__title">Togetzer</span>
                    </div>
                    <iframe
                        className="frame__iframe frame__iframe--trips"
                        title="Trajets en covoiturage"
                        src={process.env.TOGETZER_IFRAME_URL}
                    ></iframe>
                </div>
            ) : (
                <Callout kind="info" icon="🚧">
                    Les trajets ne sont pas encore disponibles. Reviens plus tard !
                </Callout>
            )}
        </div>
    );
};

export default TripPage;
