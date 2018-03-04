/* @flow */
import React from "react";
import {withRouter} from 'react-router-dom';
import {Segment, Form, Button, Divider} from 'semantic-ui-react'

import Wrapper from "../../utils/basics/Wrapper/index";
import {login} from "../store"
import {LOGIN_URL} from "../constants"
import {postCallApi} from "../../utils/api/fetchMiddleware";


class LogIn extends React.Component {
    constructor() {
        super();
        this.state = {email: "", password: ""};

        this.onClickLogin = this.onClickLogin.bind(this);
        this.onClickReset = this.onClickReset.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.nextPath = this.nextPath.bind(this);
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
                // alert("Login successfull " + jsonData.username + " !");
            })
            .catch(error => alert(error))
        // .then(() => this.onClickReset());
    }

    onClickReset() {
        this.setState({email: "", password: ""});
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleKeyPress(event) {
        if(event.key === 'Enter')
            this.onClickLogin();
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <Wrapper column style={{...this.props.style}}>
                <Form>
                    <Form.Input required type='text'
                                fluid
                                id="emailInput"
                                label='Email'
                                name='email'
                                value={this.state.email}
                                onKeyPress={this.handleKeyPress}
                                onChange={this.handleChange}/>


                    <Form.Input required type='password'
                                fluid
                                label='Password'
                                name='password'
                                onKeyPress={this.handleKeyPress}
                                value={this.state.password}
                                onChange={this.handleChange}/>
                </Form>
                <Segment>
                    <Button primary fluid onClick={this.onClickLogin}>Je me connecte</Button>
                    <Divider horizontal>Ou</Divider>
                    <Button secondary fluid onClick={() => this.nextPath('/register')}>Je m'inscris</Button>
                </Segment>
            </Wrapper>
        );
    }
}

export default withRouter(LogIn);
