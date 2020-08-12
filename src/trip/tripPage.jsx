import React from "react"
import { Grid } from 'semantic-ui-react'

import OnlyWhenConnectedWrapper from "../utils/login/onlyWhenConnectedWrapper"
import TripContextProvider from './TripContext'
import TripsTable from './components/tripsTable'

const TripPage = () => {
    return (
        <OnlyWhenConnectedWrapper>
            <TripContextProvider>
                <Grid padded>
                    <Grid.Column mobile={16} tablet={16} computer={8}>
                        <TripsTable />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={8}>
                        <TripsTable isBack />
                    </Grid.Column>
                </Grid>
            </TripContextProvider>
        </OnlyWhenConnectedWrapper>
    );
};

export default TripPage
