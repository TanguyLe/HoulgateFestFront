import React from "react";
import { Button } from "semantic-ui-react";

import { getCredentials, login, logout, register, unregister } from "../store";
class WhoAmI extends React.Component {
    constructor() {
        super();
        this.state = { login: "" };

        this.changingCreds = this.changingCreds.bind(this);
    }

    changingCreds(creds) {
        if (creds.login !== this.state.login) this.setState({ login: creds.login });
    }

    componentDidMount() {
        if (window.localStorage.getItem("session")) {
            const username = window.localStorage.getItem("username");
            const accessToken = window.localStorage.getItem("accessToken");
            const refreshToken = window.localStorage.getItem("refreshToken");

            login(username, accessToken, refreshToken);
        }

        register(this.changingCreds);
        this.changingCreds(getCredentials());
    }

    componentWillUnmount() {
        unregister(this.changingCreds);
    }

    render() {
        return !this.state.login ? (
            <div className="rowFlex">
                <LoginModal />
            </div>
        ) : (
            <div className="rowFlex">
                <div className="paddingSides">{this.state.login}</div>
                <Button content="Déconnexion" onClick={logout} />
            </div>
        );
    }
}

import LoginModal from "./loginModal";

export default WhoAmI;
