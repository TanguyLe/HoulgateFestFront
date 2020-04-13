import React from "react";

import {register, unregister, getCredentials} from "../../login/store";


class OnlyWhenConnectedWrapper extends React.Component {
    constructor(){
        super();

        this.state = {};
        this.onLogin = this.onLogin.bind(this);
    }
    componentDidMount() {
        register(this.onLogin);
        this.setState(getCredentials());
    }

    componentWillUnmount() {
        unregister(this.onLogin);
    }

    onLogin(creds) {
        this.setState(creds);
    }

    render() {
        return this.state.login ? <div className={this.props.className || ""}> {this.props.children} </div>
            : <div className="Countdown">Cette page n'est accessible qu'une fois connecté !</div>;
    }
}

export default OnlyWhenConnectedWrapper;
