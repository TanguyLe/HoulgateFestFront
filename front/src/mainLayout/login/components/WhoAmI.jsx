/* @flow */
import React from "react";
import {isNil} from "lodash/fp";

import Block from "../../../utils/basics/Block/index";
import Text from "../../../utils/basics/Text/index";
import Wrapper from "../../../utils/basics/Wrapper/index";
import {getCredentials, logout, register, unregister} from "../store"
import Button from "../../../utils/basics/Button/index";


class WhoAmI extends React.Component {
    constructor() {
        super();

        this.state = {login: ""};

        this.changing_creds = this.changing_creds.bind(this);
    }

    changing_creds(creds) {
        if (creds.login !== this.state.login)
            this.setState({login: creds.login})
    }

    componentWillMount() {
        register(this.changing_creds);
        this.changing_creds(getCredentials());
    }

    componentWillUnmount() {
        unregister(this.changing_creds);
    }

    render() {
        let ContentToDisplay;
        if (!this.state.login)
            ContentToDisplay = (
                <Wrapper column>
                    <Block>
                        <Block padding="small" align="left">
                            <Text weight="bold">T Pa Loggé Gros </Text>
                        </Block>
                        <Block padding="small" align="left">
                            <Text>Moi j'aime bien les abricots</Text>
                        </Block>
                    </Block>
                </Wrapper>
            );
        else
            ContentToDisplay = (
                <Wrapper column>
                    <Block>
                        <Block padding="small" align="left">
                            <Text weight="bold">Name: </Text>
                            <Text>{this.state.login}</Text>
                        </Block>
                        <Button onClick={logout}>Logout</Button>
                    </Block>
                </Wrapper>
            );
        return ContentToDisplay;
    }
}

export default WhoAmI;
