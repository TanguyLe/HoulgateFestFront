import React from "react";
import {Form} from 'semantic-ui-react';


class ContactForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            surname: '',
            firstname: '',
            phone: '',
            mail: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });

    }

    reset() {
        Object.keys(this.state).map(x => this.setState({[x]: ''}));
    }


    handleSubmit(event) {
        //Here is the function useful to check all our inputs
        event.preventDefault();
        console.log(this.state);
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Input type='text' fluid label='First name' name='firstname'
                            onChange={this.handleChange}/>
                <Form.Input type='text' fluid label='Last name' name='surname'
                            onChange={this.handleChange}/>
                <Form.Input type='text' fluid label='Phone number' name='phone'
                            onChange={this.handleChange}/>
                <Form.Input type='text' fluid label='Mail' name='mail'
                            onChange={this.handleChange}/>
                <Form.Group inline>
                    <Form.Button onClick={this.handleSubmit}>Submit</Form.Button>
                    <Form.Button onClick={this.reset.bind(this)}>Reset</Form.Button>
                </Form.Group>

            </Form>
        );
    }
}

export default ContactForm;
