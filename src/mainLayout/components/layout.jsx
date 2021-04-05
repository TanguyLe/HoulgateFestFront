import React from "react";

import NavBar from './menu'
import {leftItems, rightItems} from './menu'
import OnlyWhenConnectedWrapper from "../../utils/login/onlyWhenConnectedWrapper";
import OnlyWhenNotConnectedWrapper from "../../utils/login/onlyWhenNotConnectedWrapper";


class DefaultLayout extends React.Component {
    render() {
        const {component: Component, bigContainer: bigContainer, auth: auth, notCo: notCo} = this.props;
        return (
                <div className="DefaultLayout">
                    <NavBar leftItems={leftItems} rightItems={rightItems}
                            bigContainer={bigContainer}>
                        {
                            auth ? <OnlyWhenConnectedWrapper><Component/></OnlyWhenConnectedWrapper>
                                : (
                                    notCo ? <OnlyWhenNotConnectedWrapper><Component/></OnlyWhenNotConnectedWrapper>
                                        : <Component/>
                                        )
                        }
                    </NavBar>
                </div>)
    }
}

export default DefaultLayout;
