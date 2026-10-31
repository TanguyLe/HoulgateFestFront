import React, { useEffect } from "react";

import { TopBar, TabBar } from "./menu";
import LoginDialog from "../../login/components/loginDialog";
import OnlyWhenConnectedWrapper from "../../utils/login/onlyWhenConnectedWrapper";
import OnlyWhenNotConnectedWrapper from "../../utils/login/onlyWhenNotConnectedWrapper";
import { useCurrentEdition } from "../../editions/currentEdition";
import { getTheme, getThemeStyle, LATEST_THEME_YEAR } from "../../editions/themes";

// The whole site takes the colors of the current edition
const useEditionColors = () => {
    const { edition } = useCurrentEdition();
    const year = edition ? edition.year : LATEST_THEME_YEAR;

    useEffect(() => {
        const style = getThemeStyle(getTheme(year));
        Object.keys(style).forEach((name) =>
            document.documentElement.style.setProperty(name, style[name]),
        );
    }, [year]);
};

const DefaultLayout = ({ component: Component, bigContainer, auth, notCo }) => {
    useEditionColors();

    let content = <Component />;
    if (auth) content = <OnlyWhenConnectedWrapper>{content}</OnlyWhenConnectedWrapper>;
    else if (notCo) content = <OnlyWhenNotConnectedWrapper>{content}</OnlyWhenNotConnectedWrapper>;

    return (
        <div className="app">
            <a className="skip-link" href="#main">
                Aller au contenu
            </a>
            <TopBar />
            <main id="main" className={"page" + (bigContainer ? " page--wide" : "")}>
                {content}
            </main>
            <TabBar />
            <LoginDialog />
        </div>
    );
};

export default DefaultLayout;
