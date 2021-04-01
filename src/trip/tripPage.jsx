import React from "react"
import { Grid } from 'semantic-ui-react'

import TripContextProvider from './TripContext'
import TripsTable from './components/tripsTable'

const TripPage = () => {
    return (
            <TripContextProvider>
                <Grid padded>
                    <Grid.Column mobile={26} tablet={26} computer={12}>
                        <TripsTable />
                    </Grid.Column>
                </Grid>
            </TripContextProvider>
    );
};

export default TripPage
