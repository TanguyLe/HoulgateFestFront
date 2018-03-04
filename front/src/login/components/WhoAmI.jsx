/* @flow */
import React from "react";
import {Button} from "semantic-ui-react"

import Block from "../../utils/basics/Block/index";
import Text from "../../utils/basics/Text/index";
import Wrapper from "../../utils/basics/Wrapper/index";
import {getCredentials, logout, register, unregister} from "../store"

import LoginModal from "./LoginModal"

class WhoAmI extends React.Component {
    constructor() {
        super();

        this.state = {login: ""};

        this.changingCreds = this.changingCreds.bind(this);
        this.onClickConnect = this.onClickConnect.bind(this);
    }

    changingCreds(creds) {
        if (creds.login !== this.state.login)
            this.setState({login: creds.login})
    }

    componentWillMount() {
        register(this.changingCreds);
        this.changingCreds(getCredentials());
    }

    componentWillUnmount() {
        unregister(this.changingCreds);
    }

    onClickConnect() {

    }

    render() {
        let ContentToDisplay;
        if (!this.state.login)
            ContentToDisplay = (
                <Wrapper column>
                    <Block noPadding align="left">
                       <LoginModal/>
                    </Block>
                </Wrapper>
            );
        else
            ContentToDisplay = (
                <Wrapper line>
                    <Text style={{paddingRight: "10px", margin: "auto"}} color="white">{this.state.login}</Text>
                    <Button onClick={logout}>Déconnection</Button>
                </Wrapper>
            );
        return ContentToDisplay;
    }
}

export default WhoAmI;
