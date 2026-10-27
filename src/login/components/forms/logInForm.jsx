import React from "react";

import { login } from "../../store";
import { LOGIN_URL } from "../../constants";
import { UNKNOWN_ERROR_MSG } from "../../../labels";
import { postCallApi } from "../../../utils/api/fetchMiddleware";
import { Field } from "../../../ui/components";
import { notify } from "../../../ui/toast";

export default class LogIn extends React.Component {
    constructor() {
        super();
        // The form lives in a dialog that is unmounted on close, so it never needs a reset
        this.state = { email: "", password: "", wrongField: "", wrongMsg: "", loading: false };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClickRegister = this.onClickRegister.bind(this);
        this.onClickPasswordReset = this.onClickPasswordReset.bind(this);
    }

    onClickPasswordReset() {
        this.props.history.push("/createPasswordReset");
        this.props.toClose();
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
                this.setState({ loading: false });

                if (failure) {
                    this.setState({ wrongField: jsonData.wrongField, wrongMsg: jsonData.message });

                    if (jsonData.wrongField === "activation")
                        notify.error(
                            "Le compte n’est pas activé ! Utilise le lien que tu as reçu par mail.",
                        );
                } else {
                    // Close first: login() re-renders WhoAmI, which unmounts this dialog
                    this.props.toClose();
                    login(jsonData.username, jsonData.accessToken, jsonData.refreshToken);
                    notify.success("Bienvenue " + jsonData.username + " !");
                }
            })
            .catch(() => {
                this.setState({ loading: false });
                notify.error(UNKNOWN_ERROR_MSG);
            });
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
        const { wrongField, wrongMsg, loading } = this.state;

        return (
            <form className="form" onSubmit={this.onSubmit} noValidate>
                <Field
                    type="email"
                    id="emailInput"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    error={wrongField === "email" && (wrongMsg || true)}
                    value={this.state.email}
                    onChange={this.handleChange}
                />
                <Field
                    type="password"
                    label="Mot de passe"
                    name="password"
                    autoComplete="current-password"
                    error={wrongField === "password" && (wrongMsg || true)}
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <a className="login__forgot" onClick={this.onClickPasswordReset}>
                    Mot de passe oublié ?
                </a>
                <button
                    type="submit"
                    className="btn btn--primary btn--lg btn--block"
                    disabled={loading}
                >
                    {loading ? "Connexion…" : "Je me connecte"}
                </button>
                <div className="login__divider">
                    <span>pas encore de compte ?</span>
                </div>
                <button
                    type="button"
                    className="btn btn--lg btn--block"
                    onClick={this.onClickRegister}
                >
                    Je m’inscris
                </button>
            </form>
        );
    }
}
