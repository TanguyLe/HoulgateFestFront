import React from "react";

import { login } from "../../store";
import { LOGIN_URL } from "../../constants";
import { UNKNOWN_ERROR_MSG } from "../../../labels";
import { postCallApi } from "../../../utils/api/fetchMiddleware";
import { Field } from "../../../ui";

export default class LogIn extends React.Component {
    constructor() {
        super();
        // The component is destroyed when the dialog closes, it is consequently coded without reset
        this.state = { email: "", password: "", wrongField: "" };

        this.onClickLogin = this.onClickLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    onClickLogin(event) {
        if (event) event.preventDefault();
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

    onClickRegister() {
        this.props.history.push("/register");
        this.props.toClose();
    }

    render() {
        return (
            <form className="form login-form" onSubmit={this.onClickLogin} noValidate>
                <Field label="Email" htmlFor="emailInput" error={this.state.wrongField === "email"}>
                    <input
                        className="input"
                        type="email"
                        id="emailInput"
                        name="email"
                        autoComplete="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </Field>
                <Field
                    label="Mot de passe"
                    htmlFor="passwordInput"
                    error={this.state.wrongField === "password"}
                >
                    <input
                        className="input"
                        type="password"
                        id="passwordInput"
                        name="password"
                        autoComplete="current-password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </Field>
                {(this.state.wrongField === "email" || this.state.wrongField === "password") && (
                    <p className="login-form__error" role="alert">
                        {this.state.wrongField === "email"
                            ? "Cet email ne nous dit rien."
                            : "Mauvais mot de passe."}
                    </p>
                )}
                <button type="button" className="linkish" onClick={this.onClickPasswordReset}>
                    Mot de passe oublié ?
                </button>
                <button type="submit" className="btn btn--primary btn--block">
                    Je me connecte
                </button>
                <div className="login-form__or label" aria-hidden="true">
                    <span>Ou</span>
                </div>
                <button type="button" className="btn btn--block" onClick={this.onClickRegister}>
                    Je m'inscris
                </button>
            </form>
        );
    }
}
