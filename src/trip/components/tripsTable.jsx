import React, { useEffect, useState } from 'react'
import { Table, Button } from 'semantic-ui-react'

import { getCredentials, register, unregister } from '../../login/store'
import dateFormat from '../../utils/dateFormat'

const TripsTable = ({ trips, isBack }) => {
    const [title] = useState(isBack ? 'Trajets retour' : 'Trajets Aller')
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
        <Table textAlign="center" size="small" celled striped compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={credentials ? 5 : 4}>
                        { credentials ? <>{title}<Button size="mini" floated='right' primary compact>Nouveau</Button></> : title }
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Conducteur</Table.HeaderCell>
                    <Table.HeaderCell>Depart</Table.HeaderCell>
                    <Table.HeaderCell>Lieu</Table.HeaderCell>
                    <Table.HeaderCell>Passagers</Table.HeaderCell>
                    { credentials ? <Table.HeaderCell>Actions</Table.HeaderCell> : null }
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
                        { credentials ? 
                            <Table.Cell>
                                <Button size="mini" disabled={credentials != trip.driver.username} compact>Modifier</Button>
                                <Button size="mini" disabled={credentials != trip.driver.username} compact>Supprimer</Button>
                            </Table.Cell> 
                        : null }
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default TripsTable
