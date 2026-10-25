import React from "react";

import OnlyWhenConnectedWrapper from "../../utils/login/onlyWhenConnectedWrapper";
import OnlyWhenNotConnectedWrapper from "../../utils/login/onlyWhenNotConnectedWrapper";

/**
 * Page container. `width` is one of "narrow" (forms), "full" (edge-to-edge, the page
 * handles its own gutters) or the default content width.
 */
const DefaultLayout = ({ component: Component, width, auth, notCo }) => {
    let content = <Component />;

    if (auth) content = <OnlyWhenConnectedWrapper>{content}</OnlyWhenConnectedWrapper>;
    else if (notCo) content = <OnlyWhenNotConnectedWrapper>{content}</OnlyWhenNotConnectedWrapper>;

    return <div className={"page" + (width ? " page--" + width : "")}>{content}</div>;
};

export default DefaultLayout;
