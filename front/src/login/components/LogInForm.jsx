/* @flow */
import React from "react";
import {withRouter} from 'react-router-dom';
import {Segment, Form, Button, Divider} from 'semantic-ui-react'

import {login} from "../store"
import {LOGIN_URL} from "../constants"
import {postCallApi} from "../../utils/api/fetchMiddleware";


class LogIn extends React.Component {
    constructor() {
        super();
        // The component is destroyed at closing by semantic-ui portal, which is not the expected behavior
        // It is consequently coded without reset
        this.state = {email: "", password: ""};

        this.onClickLogin = this.onClickLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onClickRegister = this.onClickRegister.bind(this);
    }

    componentDidMount() {
        const emailInput = document.querySelector('#emailInput');
        setTimeout(() => emailInput.focus(), 0);
    }

    onClickLogin() {
        postCallApi(LOGIN_URL, this.state, false)
            .then((response) => {
                if (!response.ok)
                    throw Error("requête");
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                login(jsonData.username, jsonData.accessToken, jsonData.refreshToken);
            })
            .catch(error => alert(error))
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleKeyPress(event) {
        if(event.key === 'Enter')
            this.onClickLogin();
    }

    onClickRegister() {
        this.props.history.push('/register');
        this.props.toClose()
    }

    render() {
        return (
            <Form>
                <Form.Input type='text'
                            fluid
                            id="emailInput"
                            label='Email'
                            name='email'
                            value={this.state.email}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.handleChange}/>


                <Form.Input type='password'
                            fluid
                            label='Password'
                            name='password'
                            value={this.state.password}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.handleChange}/>
                <Segment>
                    <Button primary fluid onClick={this.onClickLogin}>Je me connecte</Button>
                    <Divider horizontal>Ou</Divider>
                    <Button secondary fluid onClick={this.onClickRegister}>Je m'inscris</Button>
                </Segment>
            </Form>
        );
    }
}

export default withRouter(LogIn);
