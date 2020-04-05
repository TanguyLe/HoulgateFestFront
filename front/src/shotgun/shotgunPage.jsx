import React from "react";

import OnlyWhenConnectedWrapper from "../utils/login/OnlyWhenConnectedWrapper"
import ShotgunConnectedPage from './shotgunConnectedPage'

let ShotgunPage = () =>
    <OnlyWhenConnectedWrapper>
        <ShotgunConnectedPage/>
    </OnlyWhenConnectedWrapper>;

export default ShotgunPage;
