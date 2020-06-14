import React, { useEffect, useState } from 'react'
import { getCredentials, register, unregister } from '../../login/store'

import { Table, Button, Portal, Segment, Header } from 'semantic-ui-react'
import dateFormat from '../../utils/dateFormat'

import TripsModal from './tripsModal'

const TripsTable = ({ editTrip, deleteTrip, trips, isBack }) => {
    const [title] = useState(isBack ? 'Trajet retour' : 'Trajet Aller')
    const [credentials, setCredentials] = useState()
    const [connectedUser, setConnectedUser] = useState()
    const [deletePopup, setDeletePopup] = useState(false)

    useEffect(() => {
        console.log('did mount: ', credentials)
        register(setCredentials)
        setCredentials(getCredentials())
    }, [])
     
    useEffect(() => {
        console.log('credentials did update: ', credentials)
        if (credentials) setConnectedUser(credentials.login ? credentials.login : undefined)
    }, [credentials])

    const handleDeleteTrip = () => {
        setDeletePopup(false)
        /** perform deletion from db */
    }

    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='5'>
                        <>{title}</>
                        <TripsModal mode='add' floated='right' isBack primary></TripsModal>
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
                            <Button mode='edit' initialData={trip} disabled={connectedUser != trip.driver.username}>Modifier</Button>
                            <Portal
                                openOnTriggerClick
                                open={deletePopup}
                                trigger={<Button size='mini' disabled={connectedUser != trip.driver.username}  content='Supprimer'/>}
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
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default TripsTable