import React from "react";
import OnlyWhenConnectedWrapper from "../utils/login/onlyWhenConnectedWrapper"


let ScoresPage = () =>
    <OnlyWhenConnectedWrapper>
        <iframe style={{height: "420px", width: "100%", border: "none"}}
                scrolling="no"
                src={process.env.SCORES_BOARD_URL}>
        </iframe>
    </OnlyWhenConnectedWrapper>;

export default ScoresPage;
