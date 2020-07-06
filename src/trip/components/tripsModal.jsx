import React, { useEffect, useState } from 'react'

import { Button, Icon, Modal, Form, Input, Dropdown, Message } from 'semantic-ui-react'
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

    const [btnEnabled, setBtnEnabled] = useState(false)
    const [inputs, setInputs] = useState({ adress: '', seats: 0, date: '', time: '', passengers: [] })
    const [error, setError] = useState({ header: null, content: null, isHidden: true })

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            const date = dateFormat(initialData.start).split(' ')[0]
            const time = dateFormat(initialData.start).split(' ')[1]
            const passengers = initialData.passengers.map(passenger => passenger.username)
            return setInputs({ adress: initialData.adress, seats: initialData.seats, date, time, passengers })
        }
    },[])

    useEffect(() => {        
        let emptyFields = false
        
        Object.values(inputs).forEach(value => { if (typeof value !== "object" && !value) emptyFields = true; })
        if (inputs.passengers) {
            if (!inputs.passengers.length) emptyFields = true
            if (inputs.passengers.length > inputs.seats) {
                setBtnEnabled(false)
                return setError({ header: "Erreur", content: "Le nombre de passager ne peux dépasser le nombre de sièges.", isHidden: false })
            }
            setError({ header: null, content: null, isHidden: true })
        }

        if (emptyFields) return setBtnEnabled(false)
        setBtnEnabled(true)
    }, [inputs])

    const handleSubmit = (e) => {
        /** To implement database registration */
    }

    const actionType = mode === 'edit' ? 'Modifier' : 'Ajouter'

    return (
        <Modal 
            trigger={<Button size='mini' disabled={disabled} floated={floated} primary={primary}>{actionType}</Button>} 
            style={{ top: '25%' }} 
            closeIcon
        >
            <Modal.Header icon='car' content={`${actionType} trajet`} />
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
                <Message attached header={error.header} content={error.content} hidden={error.isHidden} error size="mini"/>
            </Modal.Content>
            <Modal.Actions>
                <Button primary size='mini' onClick={handleSubmit} disabled={!btnEnabled}>
                    <Icon name='checkmark' /> {actionType}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default TripsModal