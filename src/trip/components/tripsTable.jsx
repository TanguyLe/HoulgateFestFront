import React, { useState, useContext } from 'react';
import {Table, Button, Portal, Segment, Header, Popup} from 'semantic-ui-react';

import { TripContext } from '../TripContext';
import dateFormat from '../../utils/dateFormat';
import TripsModal from "./tripsModal";

const TripsButtons = (props) => {
    const { trip, isDriver, isBack, setDeletePopup, handleDeleteTrip, deletePopup } = props;

    const buttons = (
        <div>
            <TripsModal mode='edit' initialData={trip} disabled={isDriver} isBack={isBack}>
                Modifier
            </TripsModal>
        <Portal
            openOnTriggerClick
            open={deletePopup}
            trigger={<Button size='mini' disabled={isDriver}  content='Supprimer'/>}
            onOpen={() => setDeletePopup(true)}
        >
            <Segment
                style={{
                    "border": "solid 1px #666",
                    left: '40%',
                    position: 'fixed',
                    top: '40%',
                    zIndex: 1000,
                    textAlign: "center"
                }}
            >
                <Header>Êtes vous sûr de vouloir supprimer ce trajet ?</Header>
                <Button size='mini' content='Annuler' onClick={() => setDeletePopup(false)}/>
                <Button size='mini' content='Confirmer' negative onClick={() => handleDeleteTrip(trip._id)}/>
            </Segment>
        </Portal>
    </div>);
    return <Table.Cell>
        {
            !isDriver ? buttons :
                <Popup
                    flowing
                    trigger={buttons}
                    position={"top center"}
                    content={<div style={{"width": "15em"}}>
                        Le conducteur est le seul à pouvoir modifier son trajet,
                        prends contact avec lui sur fb si tu veux le rejoindre.
                    </div>
                    }
                />
        }
    </Table.Cell>
};

const TripsTable = ({ isBack }) => {
    const { login, trips, getUserById, deleteTrip } = useContext(TripContext);

    const [title] = useState(isBack ? 'Trajets retour' : 'Trajets Aller');
    const [deletePopup, setDeletePopup] = useState(false);

    const handleDeleteTrip = async (id) => {
        await deleteTrip(id);
        setDeletePopup(false);
    };
    return (
        <Table textAlign="center" size="small" celled striped compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='5'>
                        {title} <TripsModal mode='add' floated='right' isBack={isBack} primary/>
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
                { trips ?
                    trips.filter(trip => trip.type === ( isBack ? "BACK" : "FORTH")).map((trip, tripIndex) => (
                        <Table.Row
                            key={`trip-${tripIndex}`}
                            negative={trip.seats === trip.passengers.length}
                            warning={trip.passengers.length !== 0 && trip.seats > trip.passengers.length}
                            positive={trip.passengers.length === 0}
                        >
                            <Table.Cell>{getUserById(trip.driver).username}</Table.Cell>
                            <Table.Cell>{dateFormat(trip.date)}</Table.Cell>
                            <Table.Cell>{trip.location}</Table.Cell>
                            <Table.Cell>
                                <ul>{
                                    Array(trip.seats).fill().map((_, index) => (
                                        <li key={`passenger-${tripIndex}-${index}`}>
                                            {
                                                trip.passengers[index] ?
                                                    getUserById(trip.passengers[index]).username : 'Place libre'
                                            }
                                        </li>
                                    ))
                                }</ul>
                            </Table.Cell>
                            <TripsButtons
                                trip={trip}
                                isBack={isBack}
                                isDriver={login !== getUserById(trip.driver).username}
                                setDeletePopup={setDeletePopup}
                                deletePopup={deletePopup}
                                handleDeleteTrip={handleDeleteTrip}
                            />
                        </Table.Row>
                    ))
                : null}
            </Table.Body>
        </Table>
    )
};

export default TripsTable;
