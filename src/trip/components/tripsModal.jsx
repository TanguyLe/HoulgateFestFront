import React, { useEffect, useState } from 'react'

import { Button, Icon, Modal, Form, Input, Dropdown } from 'semantic-ui-react'
import dateFormat from '../../utils/dateFormat'

const TripsModal = ({ mode, initialData, disabled, floated, primary, isBack }) => {
    
    const DATA = [
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

    const [btnName, setBtnName] = useState('')
    const [inputs, setInputs] = useState({})
    const [btnState, setBtnState] = useState(false)

    useEffect(() => {

        switch (mode) {
            case 'add':
                setBtnName('Ajouter')
                break;
            case 'edit':
                if (initialData) {
                    setBtnState(true)
                    const date = dateFormat(initialData.start).split(' ')[0]
                    const time = dateFormat(initialData.start).split(' ')[1]
                    const passengers = initialData.passengers.map(passenger => passenger.username)
                    setInputs({ adress: initialData.adress, seats: initialData.seats, date, time, passengers })
                }
                setBtnName('Modifier')
            default:
                break;
        }
    },[])

    const handleSubmit = (e) => {
        /** To implement database registration */
    }

    return (
        <Modal 
            trigger={<Button size='mini' disabled={disabled} floated={floated} primary={primary}>{btnName}</Button>} 
            style={{ top: '25%' }} 
            closeIcon
        >
            <Modal.Header icon='car' content='Trajet' />
            <Modal.Content>
                <Form>
                    <Form.Field required>
                        <label>Lieu</label>
                        <Input value={inputs.adress} onChange={(e) => setInputs({ ...inputs, adress: e.target.value })} />
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
                        <label>Passagers</label>
                        <Dropdown
                            placeholder='Selection des passagers'
                            fluid
                            multiple
                            search
                            selection
                            clearable
                            options={DATA}
                            onChange={(e, { value }) => setInputs({ ...inputs, passengers: value })}
                            value={inputs.passengers}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button primary size='mini' onClick={handleSubmit} disabled={!btnState}>
                    <Icon name='checkmark' /> Valider
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default TripsModal