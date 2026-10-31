import React from "react";
import { Link } from "react-router-dom";

import { openLoginDialog } from "../loginDialog";
import { requestCurrentEdition } from "../../editions/currentEdition";
import { getMe } from "../../admin/adminApi";
import { Avatar } from "../../ui";
import { silentLogin, getCredentials, dispatch, logout, register, unregister } from "../store";

// The login state in the top bar: a login button, or the user's avatar with a small menu
class WhoAmI extends React.Component {
    constructor() {
        super();
        this.state = { login: "", isAdmin: false, menuOpen: false };

        this.menu = React.createRef();
        this.changingCreds = this.changingCreds.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    changingCreds(creds) {
        if (creds.login === this.state.login) return;

        this.setState({ login: creds.login, isAdmin: false, menuOpen: false });
        // Only to show the admin link: the back checks the rights on every admin call
        if (creds.login)
            getMe()
                .then((me) => {
                    if (this.state.login === creds.login) this.setState({ isAdmin: me.isAdmin });
                })
                .catch(() => {});
    }

    async componentDidMount() {
        document.addEventListener("mousedown", this.onDocumentClick);
        document.addEventListener("keydown", this.onKeyDown);

        if (window.localStorage.getItem("session") === "true") {
            const username = window.localStorage.getItem("username");
            const accessToken = window.localStorage.getItem("accessToken");
            const refreshToken = window.localStorage.getItem("refreshToken");

            // Let's check if we can get access the website
            silentLogin(username, accessToken, refreshToken);
            try {
                // This will try a regular call, and if needed a refresh login. The answer (the
                // current edition) is shared with the rest of the site.
                await requestCurrentEdition();
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
        document.removeEventListener("mousedown", this.onDocumentClick);
        document.removeEventListener("keydown", this.onKeyDown);
    }

    onDocumentClick(event) {
        if (this.state.menuOpen && this.menu.current && !this.menu.current.contains(event.target))
            this.closeMenu();
    }

    onKeyDown(event) {
        if (event.key === "Escape" && this.state.menuOpen) this.closeMenu();
    }

    toggleMenu() {
        this.setState({ menuOpen: !this.state.menuOpen });
    }

    closeMenu() {
        this.setState({ menuOpen: false });
    }

    render() {
        if (!this.state.login)
            return (
                <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    id="loginPortalOpener"
                    onClick={openLoginDialog}
                >
                    Connexion
                </button>
            );

        return (
            <div className="user-menu" ref={this.menu}>
                <button
                    type="button"
                    className="user-menu__trigger"
                    aria-haspopup="true"
                    aria-expanded={this.state.menuOpen}
                    onClick={this.toggleMenu}
                >
                    <Avatar name={this.state.login} size="sm" />
                    <span className="user-menu__name">{this.state.login}</span>
                    <span className="user-menu__caret" aria-hidden="true">
                        ▾
                    </span>
                </button>
                {this.state.menuOpen && (
                    <div className="user-menu__popover">
                        <div className="user-menu__hello">
                            Salut <b>{this.state.login}</b> !{" "}
                            <span className="emoji" aria-hidden="true">
                                🌊
                            </span>
                        </div>
                        {this.state.isAdmin && (
                            <Link to="/admin" className="user-menu__item" onClick={this.closeMenu}>
                                <span className="emoji" aria-hidden="true">
                                    ⚙️
                                </span>
                                Administration
                            </Link>
                        )}
                        <button
                            type="button"
                            className="user-menu__item"
                            onClick={() => {
                                this.closeMenu();
                                logout();
                            }}
                        >
                            <span className="emoji" aria-hidden="true">
                                👋
                            </span>
                            Déconnexion
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default WhoAmI;
