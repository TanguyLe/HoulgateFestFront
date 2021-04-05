import React from "react";
import { Link } from "react-router-dom";

import { register, unregister, getCredentials } from "../../login/store";

class OnlyWhenConnectedWrapper extends React.Component {
    constructor() {
        super();

        this.state = {};
        this.onLogin = this.onLogin.bind(this);
        this.onClickConnected = this.onClickConnected.bind(this);
    }
    componentDidMount() {
        register(this.onLogin);
        this.setState(getCredentials());

        this.loginPortalOpener = document.getElementById("loginPortalOpener");
    }

    componentWillUnmount() {
        unregister(this.onLogin);
        if (document.getElementById("loginPortal")) this.onClickConnected();
    }

    onLogin(creds) {
        this.setState(creds);
    }

    onClickConnected() {
        this.loginPortalOpener.click();
    }

    render() {
        return this.state.login ? (
            <div className={this.props.className || ""}> {this.props.children} </div>
        ) : (
            <div className="Countdown">
                Cette page n'est accessible qu'une fois{" "}
                <a onClick={this.onClickConnected}>connecté</a> ! N'hésite pas à{" "}
                <Link to="/register">créer un compte</Link>.
            </div>
        );
    }
}

export default OnlyWhenConnectedWrapper;
