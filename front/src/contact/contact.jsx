import React from "react";
import {Form} from 'semantic-ui-react';


export const ErrorDisplayer = ({formErrors}) =>
    <div className='ErrorDisplayer'>
        {Object.keys(formErrors).map((fieldName, i) => {
            if (formErrors[fieldName].length > 0) {
                return (
                    <p key={i}>{formErrors[fieldName]}</p>
                )
            } else {
                return '';
            }
        })}
    </div>;

class ContactForm extends React.Component {
    constructor() {
        super();
        this.state = {
            surname: '',
            firstname: '',
            phone: '',
            mail: ''
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
        this.formValid = true;
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        }, this.validateField(name, target.value));

    }

    validateField(fieldName, value, next) {
        let formErrors = this.formErrors;
        switch (fieldName) {
            case 'mail':
                formErrors.mail = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? '' : 'Le mail n\'est pas correctement formé';
                break;
            case 'surname':
                formErrors.surname = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u) ? '' : 'Le prénom est invalide';
                break;
            case 'firstname':
                formErrors.firstname = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u) ? '' : ' est invalide';
                break;
            case 'phone':
                formErrors.phone = value.match(/^[0-9]{10}$/i) ? '' : 'Le telephone est incorrect';
                break;
            default:
                break;
        }
        this.formErrors = formErrors;
        this.formValid = _.some(this.formErrors, (val) => val !== "");
    }


    reset() {
        Object.keys(this.state).map(x => this.setState({[x]: ''}));
    }


    handleSubmit(event) {
        console.log(this.state);
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <ErrorDisplayer formErrors={this.formErrors}/>
                <Form.Input required type='text' fluid label='First name' name='firstname' value={this.state.firstname}
                            onChange={this.handleChange}/>
                <Form.Input required type='text' fluid label='Last name' name='surname' value={this.state.surname}
                            onChange={this.handleChange}/>
                <Form.Input required type='text' fluid label='Phone number' name='phone' value={this.state.phone}
                            onChange={this.handleChange}/>
                <Form.Input required type='text' fluid label='Mail' name='mail' value={this.state.mail}
                            onChange={this.handleChange}/>
                <Form.Group inline>
                    <Form.Button type="submit" disabled={this.formValid}
                                 onClick={this.handleSubmit}>Submit</Form.Button>
                    <Form.Button onClick={this.reset.bind(this)}>Reset</Form.Button>
                </Form.Group>
            </Form>
        );
    }
}

export default ContactForm;
