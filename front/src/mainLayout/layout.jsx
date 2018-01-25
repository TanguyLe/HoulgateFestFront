import React from "react";
import {Grid, Container} from 'semantic-ui-react';
import {Route} from 'react-router-dom';

import Header from './menu'



const DefaultLayout = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={matchProps => (
            <div className="DefaultLayout">
                <Grid>
                    <Grid.Row>
                        <Header/>
                    </Grid.Row>
                    <Grid.Row>
                        <Container>
                            <Component {...matchProps} />
                        </Container>
                    </Grid.Row>
                </Grid>
            </div>
        )}/>
    )
};

export default DefaultLayout;
