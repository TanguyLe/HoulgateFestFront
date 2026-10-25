import React from "react";
import { Link } from "react-router-dom";

import LoginModal from "./loginModal";
import Icon from "../../ui/icon";
import { getCallApi } from "../../utils/api/fetchMiddleware";
import { EDITIONS_ENDPOINT } from "../../shotgun/constants";
import { getMe } from "../../admin/adminApi";
import { silentLogin, getCredentials, dispatch, logout, register, unregister } from "../store";

class WhoAmI extends React.Component {
    constructor() {
        super();
        this.state = { login: "", isAdmin: false };

        this.changingCreds = this.changingCreds.bind(this);
    }

    changingCreds(creds) {
        if (creds.login === this.state.login) return;

        this.setState({ login: creds.login, isAdmin: false });
        // Only to show the admin link: the back checks the rights on every admin call
        if (creds.login)
            getMe()
                .then((me) => {
                    if (this.state.login === creds.login) this.setState({ isAdmin: me.isAdmin });
                })
                .catch(() => {});
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
                // Not login() with the tokens read above: a refresh during the call replaced them
                dispatch();
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
        const username = this.state.login;

        if (!username) return <LoginModal />;

        return (
            <div className="user-pill">
                <span className="avatar" aria-hidden>
                    {username.charAt(0)}
                </span>
                <span className="user-pill__name">{username}</span>
                {this.state.isAdmin && (
                    <Link
                        to="/admin"
                        className="btn btn--ghost btn--icon btn--sm"
                        title="Administration"
                        aria-label="Administration"
                    >
                        <Icon name="users" size={18} />
                    </Link>
                )}
                <button
                    type="button"
                    className="btn btn--ghost btn--icon btn--sm"
                    onClick={logout}
                    title="Déconnexion"
                    aria-label="Déconnexion"
                >
                    <Icon name="logOut" size={18} />
                </button>
            </div>
        );
    }
}

export default WhoAmI;
