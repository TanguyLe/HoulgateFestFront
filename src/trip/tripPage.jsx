import React from "react"
import { Grid } from 'semantic-ui-react'

import TripsTable from './components/tripsTable'

const TRIPS = [
    {
        driver: {"username": "Tanguy"},
        start: new Date(),
        adress: "Paris 18",
        type: "BACK",
        seats: 3,
        "passengers": [{"username": "Baptiste"}, {"username": "Romain"}, {"username": "Othmane"}]
    },
    {
        driver: {"username": "Momo"},
        start: new Date('01 Jan 1970 00:45:00 GMT'),
        adress: "Paris 18",
        type: "BACK",
        seats: 4,
        "passengers": [{"username": "Julie"}, {"username": "Hugo"}]
    },
    {
        driver: {"username": "Patrick"},
        start: new Date('28 Jan 1979 15:30:00 GMT'),
        adress: "Montélimart",
        type: "FORTH",
        seats: 1,
        "passengers": [{"username": "Léa"}]
    },
    {
        driver: {"username": "Patrick"},
        start: new Date('05 Jan 1970 00:00:00 GMT'),
        adress: "Châlons-sur-Saone",
        type: "BACK",
        seats: 6,
        passengers: []
    }
]

const USERS = [
    { value: "Baptiste", text: "Baptiste" },
    { value: "Romain", text: "Romain" },
    { value: "Othmane", text: "Othmane" },
    { value: "Julie", text: "Julie" },
    { value: "Hugo", text: "Hugo" },
    { value: "Patrick", text: "Patrick" },
    { value: "Léa", text: "Léa" },
    { value: "Tanguy", text: "Tanguy" },
    { value: "Momo", text: "Momo" }
]

let TripPage = () => {
    return (
        <Grid padded>
            <Grid.Column mobile={16} tablet={16} computer={8}>
                <TripsTable trips={TRIPS.filter(trips => trips.type === 'FORTH')} users={USERS}/>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={8}>
                <TripsTable isBack trips={TRIPS.filter(trips => trips.type === 'BACK')} users={USERS}/>
            </Grid.Column>
        </Grid>
    );
};

export default TripPage
