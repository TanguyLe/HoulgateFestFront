import React from "react";
import { Link } from "react-router-dom";

import LogInForm from "./forms/logInForm";
import { getCallApi } from "../../utils/api/fetchMiddleware";
import { EDITIONS_ENDPOINT } from "../../shotgun/constants";
import { getMe } from "../../admin/adminApi";
import { setLoginDialogListener } from "../loginDialog";
import { silentLogin, getCredentials, dispatch, logout, register, unregister } from "../store";
import { Button, Dialog, Icon, IconButton } from "../../ui";

// The account actions of the top app bar: "Connexion" and its dialog, or the account menu.
// Also restores the session saved in localStorage when the site opens.
class WhoAmI extends React.Component {
    constructor() {
        super();
        this.state = { login: "", isAdmin: false, loginOpen: false, accountOpen: false };

        this.changingCreds = this.changingCreds.bind(this);
        this.setLoginOpen = this.setLoginOpen.bind(this);
    }

    changingCreds(creds) {
        if (creds.login === this.state.login) return;

        // Logged in: the login dialog has done its job
        this.setState({ login: creds.login, isAdmin: false, loginOpen: false });
        // Only to show the admin link: the back checks the rights on every admin call
        if (creds.login)
            getMe()
                .then((me) => {
                    if (this.state.login === creds.login) this.setState({ isAdmin: me.isAdmin });
                })
                .catch(() => {});
    }

    setLoginOpen(open) {
        this.setState({ loginOpen: open });
    }

    async componentDidMount() {
        setLoginDialogListener(this.setLoginOpen);

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
        setLoginDialogListener(null);
    }

    render() {
        const { login, isAdmin, loginOpen, accountOpen } = this.state;
        const closeAccount = () => this.setState({ accountOpen: false });

        if (!login)
            return (
                <>
                    <Button
                        variant="tonal"
                        icon="login"
                        onClick={() => this.setLoginOpen(true)}
                        aria-haspopup="dialog"
                    >
                        Connexion
                    </Button>
                    <Dialog
                        open={loginOpen}
                        onClose={() => this.setLoginOpen(false)}
                        title="Connexion"
                        sheet
                    >
                        <LogInForm toClose={() => this.setLoginOpen(false)} />
                    </Dialog>
                </>
            );

        return (
            <>
                <IconButton
                    icon="accountCircle"
                    label={"Compte de " + login}
                    onClick={() => this.setState({ accountOpen: true })}
                    aria-haspopup="dialog"
                />
                <Dialog open={accountOpen} onClose={closeAccount} title={login} sheet>
                    <ul className="account-menu">
                        {isAdmin && (
                            <li>
                                <Link
                                    to="/admin"
                                    className="account-menu__item"
                                    onClick={closeAccount}
                                >
                                    <Icon name="settings" />
                                    Administration
                                </Link>
                            </li>
                        )}
                        <li>
                            <button
                                type="button"
                                className="account-menu__item"
                                onClick={() => {
                                    closeAccount();
                                    logout();
                                }}
                            >
                                <Icon name="logout" />
                                Déconnexion
                            </button>
                        </li>
                    </ul>
                </Dialog>
            </>
        );
    }
}

export default WhoAmI;
