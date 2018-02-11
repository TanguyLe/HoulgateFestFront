import React from "react";
import {Route} from 'react-router-dom';

import NavBar from './menu'
import {leftItems, rightItems} from './menu'


const DefaultLayout = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={matchProps => (
            <div className="DefaultLayout">
                <NavBar leftItems={leftItems} rightItems={rightItems}>
                    <Component {...matchProps} />
                </NavBar>
            </div>
        )}/>
    )
};

export default DefaultLayout;
