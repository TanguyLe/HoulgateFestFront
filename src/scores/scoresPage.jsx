import React from "react";

let ScoresPage = () => (
    <iframe
        style={{ height: "900px", width: "100%", border: "none" }}
        src={process.env.SCORES_BOARD_URL}
    />
);

export default ScoresPage;
