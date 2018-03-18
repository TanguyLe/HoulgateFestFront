/* @flow */
import React from "react";
import {Button} from "semantic-ui-react"

import {getCredentials, logout, register, unregister} from "../store"
class WhoAmI extends React.Component {
    constructor() {
        super();
        this.state = {login: ""};

        this.changingCreds = this.changingCreds.bind(this);
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

    render() {
        return (!this.state.login ?
                <div className="tableDisplay">
                    <div className="tableCell">
                        <LoginModal/>
                    </div>
                </div>
                :
                (<div className="tableDisplay">
                    <div className="tableCell paddingSides">
                        {this.state.login}
                    </div>
                    <div className="tableCell">
                        <Button content="Déconnection" onClick={logout}/>
                    </div>
                </div>)
        );
    }
}


import LoginModal from "./LoginModal"

export default WhoAmI;
