import React from "react";

import { login } from "../../store";
import { LOGIN_URL } from "../../constants";
import { UNKNOWN_ERROR_MSG } from "../../../labels";
import { postCallApi } from "../../../utils/api/fetchMiddleware";
import { Callout, Field } from "../../../ui";

const WRONG_FIELD_MSG = {
    email: "On ne connaît pas cet email 🤔",
    password: "Mauvais mot de passe, essaie encore !",
};

export default class LogIn extends React.Component {
    constructor() {
        super();
        // The form is unmounted when its dialog closes: it is consequently coded without reset
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
        const wrongMsg = WRONG_FIELD_MSG[this.state.wrongField];

        return (
            <form className="form" onSubmit={this.onClickLogin} noValidate>
                <Field
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    id="emailInput"
                    label="Email"
                    name="email"
                    error={this.state.wrongField === "email"}
                    value={this.state.email}
                    onChange={this.handleChange}
                />
                <Field
                    type="password"
                    autoComplete="current-password"
                    id="passwordInput"
                    label="Mot de passe"
                    name="password"
                    error={this.state.wrongField === "password"}
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                {wrongMsg && (
                    <Callout kind="error" icon="🙈">
                        {wrongMsg}
                    </Callout>
                )}
                <div>
                    <button type="button" className="link-btn" onClick={this.onClickPasswordReset}>
                        Mot de passe oublié ?
                    </button>
                </div>
                <button type="submit" className="btn btn--primary btn--block btn--lg">
                    Je me connecte
                </button>
                <div className="divider-or">ou</div>
                <button type="button" className="btn btn--block" onClick={this.onClickRegister}>
                    <span className="emoji" aria-hidden="true">
                        ✍️
                    </span>
                    Je m'inscris
                </button>
            </form>
        );
    }
}
