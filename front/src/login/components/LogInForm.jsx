/* @flow */
import React from "react";

import Button from "../../utils/basics/Button/index";
import Block from "../../utils/basics/Block/index";
import TextBlock from "../../utils/basics/TextBlock/index";
import Wrapper from "../../utils/basics/Wrapper/index";
import {login} from "../store"
import {LOGIN_URL} from "../constants"
import {postCallApi, getCallApi} from "../../utils/api/fetchMiddleware";
// Should be only post, get is for testing now

class LogIn extends React.Component {
    constructor() {
        super();
        this.state = {email: "", password: ""};

        this.onClickLogin = this.onClickLogin.bind(this);
        this.onClickReset = this.onClickReset.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    onClickLogin() {
        // postCallApi(LOGIN_URL, this.state, false)
        getCallApi(LOGIN_URL, false)
            .then((response) => {
                if (!response.ok)
                    throw Error("requête");
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                login(jsonData.username, jsonData.accessToken, jsonData.refreshToken);
                alert("Login successfull " + jsonData.username + " !");
            })
            .catch(error => alert(error))
            .then(() => this.onClickReset());
    }

    onClickReset() {
        this.setState({email: "", password: ""});
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <Wrapper column style={{...this.props.style}}>
                <Block padding="small">
                    <TextBlock weight="bold" padding="small">
                        Email:
                    </TextBlock>
                    <input name="email" value={this.state.email} onChange={this.handleChange}/>
                </Block>
                <Block padding="small">
                    <TextBlock weight="bold" padding="small">
                        Password:
                    </TextBlock>
                    <input name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
                </Block>
                <Block>
                    <Button onClick={this.onClickLogin}>
                        Send
                    </Button>
                    <Button onClick={this.onClickReset}>
                        Reset
                    </Button>
                </Block>
            </Wrapper>
        );
    }
}

export default LogIn;
