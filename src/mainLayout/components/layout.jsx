import React from "react";

import NavBar from "./menu";
import OnlyWhenConnectedWrapper from "../../utils/login/onlyWhenConnectedWrapper";
import OnlyWhenNotConnectedWrapper from "../../utils/login/onlyWhenNotConnectedWrapper";
import useEditionTheme from "../../editions/useEditionTheme";
import { themeStyle } from "../../editions/themes";

// The whole site wears the current edition's colours
const DefaultLayout = ({ component: Component, bigContainer, fullWidth, auth, notCo }) => {
    const { theme } = useEditionTheme();

    let page = <Component />;
    if (auth) page = <OnlyWhenConnectedWrapper>{page}</OnlyWhenConnectedWrapper>;
    else if (notCo) page = <OnlyWhenNotConnectedWrapper>{page}</OnlyWhenNotConnectedWrapper>;

    return (
        <div className="DefaultLayout" style={themeStyle(theme)}>
            <NavBar width={fullWidth ? "full" : bigContainer ? "wide" : "text"} year={theme.year}>
                {page}
            </NavBar>
        </div>
    );
};

export default DefaultLayout;
