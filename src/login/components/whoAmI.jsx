import React from "react";
import { Link } from "react-router-dom";

import LoginModal from "./loginModal";
import { getCallApi } from "../../utils/api/fetchMiddleware";
import { EDITIONS_ENDPOINT } from "../../shotgun/constants";
import { getMe } from "../../admin/adminApi";
import { silentLogin, getCredentials, dispatch, logout, register, unregister } from "../store";
import { Avatar } from "../../ui";
import Icon from "../../ui/icons";

class WhoAmI extends React.Component {
    constructor() {
        super();
        this.state = { login: "", isAdmin: false };

        this.changingCreds = this.changingCreds.bind(this);
    }

    changingCreds(creds) {
        if (creds.login === this.state.login) return;

        this.setState({ login: creds.login, isAdmin: false });
        if (this.props.onAdminChange) this.props.onAdminChange(false);
        // Only to show the admin link: the back checks the rights on every admin call
        if (creds.login)
            getMe()
                .then((me) => {
                    if (this.state.login === creds.login) {
                        this.setState({ isAdmin: me.isAdmin });
                        if (this.props.onAdminChange) this.props.onAdminChange(me.isAdmin);
                    }
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
        if (!this.state.login)
            return (
                <div className="account">
                    <LoginModal />
                </div>
            );

        return (
            <div className="account">
                {this.state.isAdmin && (
                    <Link to="/admin" className="account__admin" title="Administration">
                        <Icon name="gear" size={18} />
                        <span className="account__admin-label">Admin</span>
                    </Link>
                )}
                <span className="account__user">
                    <Avatar name={this.state.login} />
                    <span className="account__name">{this.state.login}</span>
                </span>
                <button
                    type="button"
                    className="account__logout"
                    onClick={logout}
                    title="Déconnexion"
                >
                    <Icon name="logout" size={18} />
                    <span className="account__logout-label">Déconnexion</span>
                </button>
            </div>
        );
    }
}

export default WhoAmI;
