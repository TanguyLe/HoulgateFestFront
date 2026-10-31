import React from "react";
import { Button, Field } from "../../../ui";

import { login } from "../../store";
import { LOGIN_URL } from "../../constants";
import { UNKNOWN_ERROR_MSG } from "../../../labels";
import { postCallApi } from "../../../utils/api/fetchMiddleware";

export default class LogIn extends React.Component {
    constructor() {
        super();
        // The component is destroyed when the login dialog closes: it is coded without reset
        this.state = { email: "", password: "", wrongField: "" };

        this.onClickLogin = this.onClickLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onClickRegister = this.onClickRegister.bind(this);
        this.onClickPasswordReset = this.onClickPasswordReset.bind(this);
    }

    componentDidMount() {
        const emailInput = document.querySelector("#emailInput");
        setTimeout(() => emailInput && emailInput.focus(), 0);
    }

    onClickPasswordReset() {
        this.props.history.push("/createPasswordReset");
        this.props.toClose();
    }

    onClickLogin() {
        let failure = false;

        postCallApi(LOGIN_URL, this.state, false)
            .then((response) => {
                if (!response.ok) failure = true;
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                if (failure) {
                    this.setState({ wrongField: jsonData.wrongField });

                    if (jsonData.wrongField === "activation")
                        alert(
                            "Le compte n'est pas activé! Veuillez utiliser le lien que vous avez reçu par mail.",
                        );
                } else login(jsonData.username, jsonData.accessToken, jsonData.refreshToken);
            })
            .catch((error) => alert(UNKNOWN_ERROR_MSG));
    }

    handleChange(event) {
        if (event.target.name === this.state.wrongField && this.state.wrongField)
            this.setState({ [event.target.name]: event.target.value, wrongField: "" });
        else this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.onClickLogin();
    }

    onClickRegister() {
        this.props.history.push("/register");
        this.props.toClose();
    }

    render() {
        const { wrongField } = this.state;

        return (
            <form className="form loginForm" onSubmit={this.handleSubmit} noValidate>
                <Field
                    type="email"
                    autoComplete="email"
                    error={wrongField === "email"}
                    id="emailInput"
                    data-autofocus
                    label="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                />
                <Field
                    type="password"
                    autoComplete="current-password"
                    error={wrongField === "password"}
                    label="Mot de passe"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                {wrongField === "email" || wrongField === "password" ? (
                    <p className="form__error" role="alert">
                        {wrongField === "email"
                            ? "Cet email ne nous dit rien…"
                            : "Mauvais mot de passe, essaie encore !"}
                    </p>
                ) : null}
                <button
                    type="button"
                    className="linklike small"
                    onClick={this.onClickPasswordReset}
                >
                    Mot de passe oublié ?
                </button>
                <Button type="submit" variant="primary" className="btn--block" icon="login">
                    Je me connecte
                </Button>
                <div className="divider">
                    <span>ou</span>
                </div>
                <Button variant="secondary" className="btn--block" onClick={this.onClickRegister}>
                    Je m'inscris
                </Button>
            </form>
        );
    }
}
