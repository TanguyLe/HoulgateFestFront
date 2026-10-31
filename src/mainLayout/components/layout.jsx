import React from "react";

import NavBar from "./menu";
import OnlyWhenConnectedWrapper from "../../utils/login/onlyWhenConnectedWrapper";
import OnlyWhenNotConnectedWrapper from "../../utils/login/onlyWhenNotConnectedWrapper";

class DefaultLayout extends React.Component {
    render() {
        const { component: Component, bigContainer, bare, auth, notCo } = this.props;
        return (
            <NavBar bigContainer={bigContainer} bare={bare}>
                {auth ? (
                    <OnlyWhenConnectedWrapper>
                        <Component />
                    </OnlyWhenConnectedWrapper>
                ) : notCo ? (
                    <OnlyWhenNotConnectedWrapper>
                        <Component />
                    </OnlyWhenNotConnectedWrapper>
                ) : (
                    <Component />
                )}
            </NavBar>
        );
    }
}

export default DefaultLayout;
