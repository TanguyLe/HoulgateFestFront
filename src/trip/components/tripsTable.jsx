import React, { useEffect, useState } from 'react'
import { Table, Button } from 'semantic-ui-react'

import { getCredentials, register, unregister } from '../../login/store'
import dateFormat from '../../utils/dateFormat'

const TripsTable = ({ trips, isBack }) => {
    const [title] = useState(isBack ? 'Trajets retour' : 'Trajets Aller')
    const [login, setLogin] = useState()

    const changingLogin = (creds) => {
        if (creds.login !== login)
            setLogin(creds.login)
    }

    useEffect(() => {
        register(changingLogin)
        changingLogin(getCredentials())
        return () => {
            unregister(setLogin)
        }
    }, [])

    return (
        <Table textAlign="center" size="small" celled striped compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={login ? 5 : 4}>
                        { login ? <>{title}<Button size="mini" floated='right' primary compact>Nouveau</Button></> : title }
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Conducteur</Table.HeaderCell>
                    <Table.HeaderCell>Depart</Table.HeaderCell>
                    <Table.HeaderCell>Lieu</Table.HeaderCell>
                    <Table.HeaderCell>Passagers</Table.HeaderCell>
                    { login ? <Table.HeaderCell>Actions</Table.HeaderCell> : null }
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
                        { login ? 
                            <Table.Cell>
                                <Button size="mini" disabled={login != trip.driver.username} compact>Modifier</Button>
                                <Button size="mini" disabled={login != trip.driver.username} compact>Supprimer</Button>
                            </Table.Cell> 
                        : null }
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default TripsTable
