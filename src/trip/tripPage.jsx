import React from "react"

import TripContextProvider from './TripContext'
import TripsTable from './components/tripsTable'

const TripPage = () => {
    return (
        <TripContextProvider>
            <TripsTable/>
        </TripContextProvider>
    );
};

export default TripPage
