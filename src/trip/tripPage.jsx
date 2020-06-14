import React from "react"
import TripsTable from './components/tripsTable'
import { Grid } from 'semantic-ui-react'

let TripPage = () => {

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

    return (<>
        <Grid divided='vertically'>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <TripsTable trips={DATA.filter(data => data.type === 'FORTH')}></TripsTable>
                </Grid.Column>
                <Grid.Column>
                    <TripsTable isBack trips={DATA.filter(data => data.type === 'BACK')}></TripsTable>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </>);
};

export default TripPage
