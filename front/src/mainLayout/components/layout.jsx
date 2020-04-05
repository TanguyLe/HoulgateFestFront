import React from "react";

import NavBar from './menu'
import {leftItems, rightItems} from './menu'


class DefaultLayout extends React.Component {
    render() {
        const {component: Component, bigContainer: bigContainer} = this.props;
        return (
                <div className="DefaultLayout">
                    <NavBar leftItems={leftItems} rightItems={rightItems}
                            bigContainer={bigContainer}>
                        <Component />
                    </NavBar>
                </div>)
    }
}

export default DefaultLayout;
