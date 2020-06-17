import React, { useEffect, useState } from 'react'
import { Table, Button } from 'semantic-ui-react'

import { getCredentials, register, unregister } from '../../login/store'
import dateFormat from '../../utils/dateFormat'

const TripsTable = ({ trips, isBack }) => {
    const [title] = useState(isBack ? 'Trajet retour' : 'Trajet Aller')
    const [credentials, setCredentials] = useState()

    const changingCreds = (creds) => {
        if (creds.login !== credentials)
            setCredentials(creds.login)
    }

    useEffect(() => {
        register(changingCreds)
        changingCreds(getCredentials())
        return () => {
            unregister(setCredentials)
        }
    }, [])

    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='5'>
                        <>{title}</>
                        <Button floated='right' primary>Ajouter</Button>
                    </Table.HeaderCell>
                    
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Conducteur</Table.HeaderCell>
                    <Table.HeaderCell>Depart</Table.HeaderCell>
                    <Table.HeaderCell>Lieu</Table.HeaderCell>
                    <Table.HeaderCell>Passagers</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {trips.map((trip, tripIndex) => (
                    <Table.Row key={`trip-${tripIndex}`}>
                        <Table.Cell>{trip.driver.username}</Table.Cell>
                        <Table.Cell>{dateFormat(trip.start)}</Table.Cell>
                        <Table.Cell>{trip.adress}</Table.Cell>
                        <Table.Cell>
                            <ul>{
                                Array(trip.seats).fill().map((_, index) => (
                                    <li key={`passenger-${tripIndex}-${index}`}>{trip.passengers[index] ? trip.passengers[index].username : 'Place libre'}</li>
                                ))
                            }</ul>
                        </Table.Cell>
                        <Table.Cell>
                            <Button disabled={credentials != trip.driver.username}>Modifier</Button>
                            <Button disabled={credentials != trip.driver.username}>Supprimer</Button>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default TripsTable