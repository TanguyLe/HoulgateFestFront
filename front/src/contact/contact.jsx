import React from "react";
import {Form} from 'semantic-ui-react';
import {CONTACT_URL} from "../contact/constants";
import {postCallApi} from "../utils/api/fetchMiddleware";


class ContactForm extends React.Component {
    constructor() {
        super();
        this.state = {
            surname: '',
            firstname: '',
            phone: '',
            mail: '',
            content: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateField = this.validateField.bind(this);
        this.formErrors = {
            surname: '',
            firstname: '',
            phone: '',
            mail: ''
        };
        this.formValid = false;
        this.getInitialState = this.getInitialState.bind(this);
    }

    getInitialState() {
        return {
            surname: '',
            firstname: '',
            phone: '',
            mail: '',
            content: ''
        };
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        }, this.validateField(name, target.value));

    }

    validateField(fieldName, value) {
        let formErrors = this.formErrors;
        switch (fieldName) {
            case 'mail':
                formErrors.mail = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? '' : 'Le mail n\'est pas correctement formé';
                break;
            case 'surname':
                formErrors.surname = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u) ? '' : 'Le nom est invalide';
                break;
            case 'firstname':
                formErrors.firstname = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u) ? '' : 'Le prénom est invalide';
                break;
            case 'phone':
                formErrors.phone = value.match(/^[0-9]{10}$/i) ? '' : 'Le téléphone est incorrect';
                break;
            default:
                break;
        }
        if (!value) {
            console.log(fieldName);
            formErrors[fieldName] = '';
        }
        this.formErrors = formErrors;
        this.formValid = !(_.some(this.formErrors, (val) => val !== ""));
    }


    reset() {
        this.setState(this.getInitialState());
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.formValid) {
            let mailContent = this.state;
            postCallApi(CONTACT_URL, {mailContent}, false)
                .then((response) => {
                    this.reset();
                    alert('Mail envoyé')
                })
                .catch(error => console.log(error))
        }
        else {
            alert('Le formulaire n\'est pas valide')
        }
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Input required
                            type='text'
                            fluid
                            label='Prénom'
                            error={this.formErrors.firstname !== ''}
                            name='firstname'
                            value={this.state.firstname}
                            onChange={this.handleChange}/>
                <Form.Input required
                            type='text'
                            fluid
                            label='Nom de famille'
                            error={this.formErrors.surname !== ''}
                            name='surname'
                            value={this.state.surname}
                            onChange={this.handleChange}/>
                <Form.Input required
                            type='text'
                            fluid
                            label='Numéro de téléphone'
                            error={this.formErrors.phone !== ''}
                            name='phone'
                            value={this.state.phone}
                            onChange={this.handleChange}/>
                <Form.Input required
                            type='text'
                            fluid
                            label='Mail'
                            error={this.formErrors.mail !== ''}
                            name='mail'
                            value={this.state.mail}
                            onChange={this.handleChange}/>
                <Form.TextArea
                    type='text'
                    name='content'
                    label='Contenu de la demande'
                    value={this.state.content}
                    onChange={this.handleChange}/>
                <Form.Group inline>
                    <Form.Button type="submit" //disabled={this.formValid}
                                 onClick={this.handleSubmit}>Submit</Form.Button>
                    <Form.Button type="reset" onClick={this.reset.bind(this)}>Reset</Form.Button>
                </Form.Group>
            </Form>
        );
    }
}

export default ContactForm;
