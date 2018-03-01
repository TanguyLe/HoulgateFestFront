import React from "react";
import {Form} from 'semantic-ui-react';


export const ErrorDisplayer = ({formErrors}) =>
    <div className='ErrorDisplayer'>
        {Object.keys(formErrors).map((fieldName, i) => {
            if (formErrors[fieldName].length > 0) {
                console.log("Error detected");
                return (
                    <p key={i}>{fieldName} {formErrors[fieldName]}</p>
                )
            } else {
                return '';
            }
        })}
    </div>;

class ContactForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            surname: '',
            firstname: '',
            phone: '',
            mail: '',
            formErrors: {
                surname: '',
                firstname: '',
                phone: '',
                mail: ''
            },
            formValid: {
                surname: false,
                firstname: false,
                phone: false,
                mail: false
            },
            globalValid: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        }, () => this.validateField(name, target.value));

    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let formValid = this.state.formValid;
        switch (fieldName) {
            case 'mail':
                formValid.mail = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.mail = formValid.email ? '' : ' est invalide';
                break;
            case 'surname':
                formValid.surname = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);
                fieldValidationErrors.surname = formValid.surname ? '' : ' est invalide';
                break;
            case 'firstname':
                formValid.firstname = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);
                fieldValidationErrors.firstname = formValid.firstname ? '' : ' est invalide';
                break;
            case 'phone':
                formValid.phone = value.match(/^[0-9]{10}$/i);
                fieldValidationErrors.phone = formValid.phone ? '' : ' est incorrect';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            formValid: formValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({globalValid: _.every(this.state.formValid)})
    }

    reset() {
        Object.keys(this.state).map(x => this.setState({[x]: ''}));
    }


    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <ErrorDisplayer formErrors={this.state.formErrors}/>
                <Form.Input required type='text' fluid label='First name' name='firstname' value={this.state.firstname}
                            onChange={this.handleChange}/>
                <Form.Input required type='text' fluid label='Last name' name='surname' value={this.state.surname}
                            onChange={this.handleChange}/>
                <Form.Input required type='text' fluid label='Phone number' name='phone' value={this.state.phone}
                            onChange={this.handleChange}/>
                <Form.Input required type='text' fluid label='Mail' name='mail' value={this.state.mail}
                            onChange={this.handleChange}/>
                <Form.Group inline>
                    <Form.Button type="submit" disabled={!this.state.globalValid}
                                 onClick={this.handleSubmit}>Submit</Form.Button>
                    <Form.Button onClick={this.reset.bind(this)}>Reset</Form.Button>
                </Form.Group>
            </Form>
        );
    }
}

export default ContactForm;
