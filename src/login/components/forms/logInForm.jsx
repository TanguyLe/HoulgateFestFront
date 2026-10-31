import React from "react";

import { login } from "../../store";
import { LOGIN_URL } from "../../constants";
import { UNKNOWN_ERROR_MSG } from "../../../labels";
import { postCallApi } from "../../../utils/api/fetchMiddleware";
import { Button, Notice, TextField, showError } from "../../../ui";

const FIELD_ERRORS = {
    email: "Aucun compte n'utilise cet email.",
    password: "Le mot de passe ne correspond pas.",
};

// The login form of the login dialog
export default class LogIn extends React.Component {
    constructor() {
        super();
        this.state = { email: "", password: "", wrongField: "", loading: false };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        let failure = false;
        this.setState({ loading: true });

        postCallApi(LOGIN_URL, { email: this.state.email, password: this.state.password }, false)
            .then((response) => {
                if (!response.ok) failure = true;
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                if (failure) this.setState({ wrongField: jsonData.wrongField, loading: false });
                else login(jsonData.username, jsonData.accessToken, jsonData.refreshToken);
            })
            .catch(() => {
                this.setState({ loading: false });
                showError(UNKNOWN_ERROR_MSG);
            });
    }

    handleChange(event) {
        if (event.target.name === this.state.wrongField && this.state.wrongField)
            this.setState({ [event.target.name]: event.target.value, wrongField: "" });
        else this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const { wrongField, loading } = this.state;

        return (
            <form className="form" onSubmit={this.onSubmit} noValidate>
                {wrongField === "activation" && (
                    <Notice tone="warning" title="Ton compte n'est pas activé">
                        Utilise le lien que tu as reçu par mail à l'inscription.
                    </Notice>
                )}
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={this.state.email}
                    error={wrongField === "email" ? FIELD_ERRORS.email : ""}
                    onChange={this.handleChange}
                    data-autofocus
                />
                <TextField
                    label="Mot de passe"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={this.state.password}
                    error={wrongField === "password" ? FIELD_ERRORS.password : ""}
                    onChange={this.handleChange}
                />
                <Button
                    variant="text"
                    to="/createPasswordReset"
                    onClick={this.props.toClose}
                    className="form__aside"
                >
                    Mot de passe oublié ?
                </Button>
                <div className="form__actions form__actions--stacked">
                    <Button type="submit" loading={loading}>
                        Je me connecte
                    </Button>
                    <Button variant="outlined" to="/register" onClick={this.props.toClose}>
                        Créer un compte
                    </Button>
                </div>
            </form>
        );
    }
}
