import React, { useEffect, useState, useContext } from 'react'
import { Button, Icon, Modal, Form, Input, Dropdown, Message } from 'semantic-ui-react'

import { TripContext } from '../TripContext'
import dateFormat from '../../utils/dateFormat'

const TripsModal = ({ mode, initialData, disabled, floated, primary, isBack }) => {
    const { login, users, createTrip, updateTrip, getUserByUsername } = useContext(TripContext)

    const [modalOpen, setModalOpen] = useState(undefined)
    const [btnEnabled, setBtnEnabled] = useState(false)
    const [inputs, setInputs] = useState({ location: '', seats: 0, date: '', time: '', passengers: [] })
    const [error, setError] = useState({ header: null, content: null, isHidden: true })

    useEffect(() => {
        if (initialData) {
            const date = dateFormat(initialData.date).split(' ')[0]
            const time = dateFormat(initialData.date).split(' ')[1]
            const { _id, driver, location, passengers, seats, type } = initialData
            return setInputs({ _id, date, time, driver, location, passengers, seats, type })
        }
    },[])

    useEffect(() => {
        let emptyFields = false
        
        Object.values(inputs).forEach(value => { 
            if (typeof value !== "object" && !value) {
                emptyFields = true;
            } 
        })
        if (inputs.passengers) {
            if (!inputs.passengers.length) emptyFields = true
            if (inputs.passengers.length > inputs.seats) {
                setBtnEnabled(false)
                return setError({ header: "Erreur", content: "Le nombre de passagers ne peut dépasser le nombre de sièges.", isHidden: false })
            }
            setError({ header: null, content: null, isHidden: true })
        }
        if (emptyFields) return setBtnEnabled(false)
        setBtnEnabled(true)
    }, [inputs])

    const handleSubmit = async () => {
        const driver = getUserByUsername(login)._id
        const { _id, location, seats, date, time, passengers } = inputs
        const fullDate = new Date(`${date} ${time}`)
        const type = isBack ? "BACK" : "FORTH"
        switch (mode) {
            case "add":
                await createTrip({ driver, location, seats, date: fullDate, passengers, type })
                break;
            case "edit":
                await updateTrip(_id, { driver, location, seats, date: fullDate, passengers, type })
                break;
            default:
                break;
        }
        setInputs({ location: '', seats: 0, date: '', time: '', passengers: [] })
        setModalOpen(false)
    }

    const actionType = mode === 'edit' ? 'Modifier' : 'Ajouter'

    return (
        <Modal
            open={modalOpen}
            closeIcon
            onClose={() => setModalOpen(false)}
            trigger={
                <Button 
                    size='mini' 
                    disabled={disabled} 
                    floated={floated} 
                    primary={primary} 
                    onClick={(e) => {
                        e.preventDefault
                        setModalOpen(true)
                    }}
                >
                    {actionType}
                </Button>}
            style={{ top: '25%' }} 
        >
            <Modal.Header icon='car' content={`${actionType} trajet`} />
            <Modal.Content>
                <Form>
                    <Form.Field required>
                        <label>Lieu</label>
                        <Input value={inputs.location} onChange={(e) => setInputs({ ...inputs, location: e.target.value })} />
                    </Form.Field>
                    <Form.Group inline>
                        <Form.Field required>
                            <label>Date</label>
                            <Input type='date' value={inputs.date} onChange={(e) => setInputs({ ...inputs, date: e.target.value })}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Heure</label>
                            <Input type='time' value={inputs.time} onChange={(e) => setInputs({ ...inputs, time: e.target.value })}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Places libres</label>
                            <Input type='number' min='1' value={inputs.seats} onChange={(e) => setInputs({ ...inputs, seats: e.target.value })}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Field required>
                        <label>Passagers</label>{
                        users ?
                        <Dropdown
                            placeholder='Selection des passagers'
                            fluid
                            multiple
                            search
                            selection
                            clearable
                            options={users.filter(user => user.username !== login).map(user => ({ value: user._id, text: user.username }))}
                            onChange={(e, { value }) => setInputs({ ...inputs, passengers: value })}
                            value={inputs.passengers}
                        />
                        : null }
                    </Form.Field>
                </Form>
                <Message attached header={error.header} content={error.content} hidden={error.isHidden} error size="mini"/>
            </Modal.Content>
            <Modal.Actions>
                <Button primary size='mini' onClick={() => handleSubmit()} disabled={!btnEnabled}>
                    <Icon name='checkmark' /> {actionType}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default TripsModal
