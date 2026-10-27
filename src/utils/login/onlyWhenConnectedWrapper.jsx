import React from "react";
import { Link } from "react-router-dom";

import { register, unregister, getCredentials } from "../../login/store";
import Icon from "../../ui/icon";

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
    }

    componentWillUnmount() {
        unregister(this.onLogin);
    }

    onLogin(creds) {
        this.setState(creds);
    }

    onClickConnected() {
        // The login dialog lives in the top bar, we just press its opener
        const opener = document.getElementById("loginPortalOpener");
        if (opener) opener.click();
    }

    render() {
        return this.state.login ? (
            <div className={this.props.className || ""}>{this.props.children}</div>
        ) : (
            <div className="locked">
                <span className="locked__badge">
                    <Icon name="lock" size={30} />
                </span>
                <h1>Réservé aux festivaliers</h1>
                <p>Cette page n’est accessible qu’une fois connecté. Pas encore de compte ?</p>
                <div className="locked__actions">
                    <button
                        type="button"
                        className="btn btn--primary btn--lg"
                        onClick={this.onClickConnected}
                    >
                        Se connecter
                    </button>
                    <Link to="/register" className="btn btn--lg">
                        Créer un compte
                    </Link>
                </div>
            </div>
        );
    }
}

export default OnlyWhenConnectedWrapper;
