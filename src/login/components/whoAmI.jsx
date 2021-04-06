import React from "react";
import { Button } from "semantic-ui-react";

import LoginModal from "./loginModal";
import { getCallApi } from "../../utils/api/fetchMiddleware";
import { EDITIONS_ENDPOINT } from "../../shotgun/constants";
import { silentLogin, getCredentials, login, logout, register, unregister } from "../store";

class WhoAmI extends React.Component {
    constructor() {
        super();
        this.state = { login: "" };

        this.changingCreds = this.changingCreds.bind(this);
    }

    changingCreds(creds) {
        if (creds.login !== this.state.login) this.setState({ login: creds.login });
    }

    async componentDidMount() {
        if (window.localStorage.getItem("session") === "true") {
            const username = window.localStorage.getItem("username");
            const accessToken = window.localStorage.getItem("accessToken");
            const refreshToken = window.localStorage.getItem("refreshToken");

            // Let's check if we can get access the website
            silentLogin(username, accessToken, refreshToken);
            try {
                // This will try a regular call, and if needed a refresh login
                await getCallApi(EDITIONS_ENDPOINT + "?current=true", true, false);
                login(username, accessToken, refreshToken);
            } catch {
                // If we can't, it means the refresh token is invalid and we better logout
                logout();
            }
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

export default WhoAmI;
