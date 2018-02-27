import React from "react";
import {Route} from 'react-router-dom';

import NavBar from './menu'
import {leftItems, rightItems} from './menu'


class DefaultLayout extends React.Component {
    render() {
        const {component: Component, bigContainer: bigContainer, ...rest} = this.props;
        return (
            <Route {...rest} render={matchProps => (
                <div className="DefaultLayout">
                    <NavBar leftItems={leftItems} rightItems={rightItems}
                            bigContainer={bigContainer}>
                        <Component {...matchProps} />
                    </NavBar>
                </div>
            )}/>)
    }
}

export default DefaultLayout;
