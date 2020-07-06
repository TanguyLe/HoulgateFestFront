import React from "react"
import { Grid, Container } from 'semantic-ui-react'

import TripsTable from './components/tripsTable'

const DATA = [
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

let TripPage = () => {
    return (
        <Grid padded>
            <Grid.Column mobile={16} tablet={16} computer={8}>
                <TripsTable trips={DATA.filter(data => data.type === 'FORTH')}></TripsTable>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={8}>
                <TripsTable isBack trips={DATA.filter(data => data.type === 'BACK')}></TripsTable>
            </Grid.Column>
        </Grid>
    );
};

export default TripPage
