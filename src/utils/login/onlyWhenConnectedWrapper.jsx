import React from "react";
import { Link } from "react-router-dom";

import { register, unregister, getCredentials } from "../../login/store";
import { openLoginDialog } from "../../login/loginDialog";

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
            <div className="card gate">
                <div className="gate__emoji emoji" aria-hidden="true">
                    🔒
                </div>
                <h1 className="gate__title">Chut, c'est entre nous !</h1>
                <p>
                    Cette page n'est accessible qu'une fois connecté ! N'hésite pas à créer un
                    compte.
                </p>
                <div className="row row--center">
                    <button type="button" className="btn btn--primary" onClick={openLoginDialog}>
                        Je me connecte
                    </button>
                    <Link to="/register" className="btn">
                        Créer un compte
                    </Link>
                </div>
            </div>
        );
    }
}

export default OnlyWhenConnectedWrapper;
