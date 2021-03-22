import React from "react";


let ScoresPage = () =>
        <iframe style={{height: "420px", width: "100%", border: "none"}}
                scrolling="no"
                src={process.env.SCORES_BOARD_URL}>
        </iframe>;

export default ScoresPage;
