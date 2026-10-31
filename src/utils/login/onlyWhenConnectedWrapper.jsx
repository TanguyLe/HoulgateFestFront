import React from "react";
import { Link } from "react-router-dom";

import { register, unregister, getCredentials } from "../../login/store";
import { openLoginPanel, closeLoginPanel } from "../../login/loginPanel";

class OnlyWhenConnectedWrapper extends React.Component {
    constructor() {
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
        closeLoginPanel();
    }

    onLogin(creds) {
        this.setState(creds);
    }

    render() {
        return this.state.login ? (
            <div className={this.props.className || ""}>{this.props.children}</div>
        ) : (
            <section className="gate">
                <p className="label gate__kicker">Accès réservé</p>
                <h1 className="gate__title">Halte-là&nbsp;!</h1>
                <p className="gate__text">
                    Cette page n'est accessible qu'une fois connecté ! N'hésite pas à créer un
                    compte.
                </p>
                <div className="btn-row">
                    <button type="button" className="btn btn--accent" onClick={openLoginPanel}>
                        Je me connecte
                    </button>
                    <Link to="/register" className="btn">
                        Créer un compte
                    </Link>
                </div>
            </section>
        );
    }
}

export default OnlyWhenConnectedWrapper;
