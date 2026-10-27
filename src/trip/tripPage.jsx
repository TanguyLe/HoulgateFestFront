import React from "react";

import { PageHeader } from "../ui/components";

const TripPage = () => (
    <div>
        <PageHeader title="Trajets">
            Propose tes places libres ou trouve une voiture pour rejoindre Houlgate.
        </PageHeader>
        <div className="embed embed--compact">
            <iframe title="Trajets Togetzer" src={process.env.TOGETZER_IFRAME_URL} />
        </div>
    </div>
);

export default TripPage;
