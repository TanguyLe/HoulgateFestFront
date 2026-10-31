import React from "react";
import { Link } from "react-router-dom";

import { register, unregister, getCredentials } from "../../login/store";
import { openLogin } from "../../login/session";
import { Button, Icon, btnClass } from "../../ui";

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
    }

    onLogin(creds) {
        this.setState(creds);
    }

    render() {
        return this.state.login ? (
            <div className={this.props.className || ""}>{this.props.children}</div>
        ) : (
            <div className="gate card card--striped">
                <span className="gate__icon" aria-hidden="true">
                    <Icon name="lock" size={28} />
                </span>
                <h2 className="gate__title">Accès réservé aux festivaliers</h2>
                <p>
                    Cette page n'est accessible qu'une fois connecté ! N'hésite pas à créer un
                    compte.
                </p>
                <div className="form__actions gate__actions">
                    <Button variant="primary" icon="login" onClick={openLogin}>
                        Me connecter
                    </Button>
                    <Link to="/register" className={btnClass("secondary")}>
                        Créer un compte
                    </Link>
                </div>
            </div>
        );
    }
}

export default OnlyWhenConnectedWrapper;
