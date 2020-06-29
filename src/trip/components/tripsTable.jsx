import React, { useEffect, useState } from 'react'
import { Table, Button, Portal, Segment, Header } from 'semantic-ui-react'

import { getCredentials, register, unregister } from '../../login/store'
import dateFormat from '../../utils/dateFormat'
import TripsModal from "./tripsModal";

const TripsTable = ({ trips, isBack }) => {
    const [title] = useState(isBack ? 'Trajets retour' : 'Trajets Aller')
    const [login, setLogin] = useState()
    const [deletePopup, setDeletePopup] = useState(false)

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

    const handleDeleteTrip = () => {
        setDeletePopup(false)
        /** perform deletion from db */
    }

    return (
        <Table textAlign="center" size="small" celled striped compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='5'>
                        <>{title}</>
                        <TripsModal mode='add' floated='right' isBack primary/>
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
                                <TripsModal mode='edit' initialData={trip} disabled={login !== trip.driver.username}>Modifier</TripsModal>
                                <Portal
                                    openOnTriggerClick
                                    open={deletePopup}
                                    trigger={<Button size='mini' disabled={login !== trip.driver.username}  content='Supprimer'/>}
                                    onOpen={() => setDeletePopup(true)}
                                    onClose={handleDeleteTrip}
                                >
                                    <Segment
                                        style={{
                                            left: '40%',
                                            position: 'fixed',
                                            top: '40%',
                                            zIndex: 1000,
                                        }}
                                    >
                                        <Header>Êtes vous sûr de vouloir supprimer ce trajet ?</Header>
                                        <Button size='mini' content='Confirmer' negative onClick={handleDeleteTrip}/>
                                    </Segment>
                                </Portal>
                            </Table.Cell>
                        : null }
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default TripsTable
