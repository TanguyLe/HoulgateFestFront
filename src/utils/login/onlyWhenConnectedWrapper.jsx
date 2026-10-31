import React from "react";

import { register, unregister, getCredentials } from "../../login/store";
import { openLoginDialog } from "../../login/loginDialog";
import { Button, Card } from "../../ui";

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
        if (this.state.login) return this.props.children;

        return (
            <Card variant="outlined" className="connect-card">
                <h1 className="headline-small">{this.props.title || "Connecte-toi"}</h1>
                <p className="body-large on-surface-variant">
                    Cette page n'est accessible qu'une fois connecté ! N'hésite pas à créer un
                    compte.
                </p>
                <div className="connect-card__actions">
                    <Button icon="login" onClick={openLoginDialog} aria-haspopup="dialog">
                        Connexion
                    </Button>
                    <Button variant="outlined" to="/register">
                        Créer un compte
                    </Button>
                </div>
            </Card>
        );
    }
}

export default OnlyWhenConnectedWrapper;
