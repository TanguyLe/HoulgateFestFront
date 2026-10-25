import React from "react";
import { CONTACT_URL, CONTACT_DEF } from "../constants";
import { postCallApi } from "../../utils/api/fetchMiddleware";
import { upCaseFirstLetter } from "../../utils/miscFcts";
import { Alert, Field } from "../../ui/components";
import Icon from "../../ui/icon";
import { notify } from "../../ui/toast";
import Captcha from "../../utils/captcha";

class ContactForm extends React.Component {
    constructor() {
        super();
        this.initialState = {};
        Object.keys(CONTACT_DEF).forEach((elem) => {
            this.initialState[elem] = {
                value: "",
                valid: true,
                errorMsg: "",
            };
        });
        // the captcha token is sent and checked by the back, its error is listed with the fields' ones
        this.initialState.captcha = { value: "", valid: true, errorMsg: "" };
        this.captcha = React.createRef();
        this.state = JSON.parse(JSON.stringify(this.initialState));
        this.state.status = "input";
        this.isFormValid = this.isFormValid.bind(this);
        this.isFieldValid = this.isFieldValid.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateField = this.validateField.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.reset = this.reset.bind(this);
        this.handleCaptchaToken = this.handleCaptchaToken.bind(this);
    }

    handleCaptchaToken(token) {
        // the error of the last submission stays displayed until the next one
        this.setState((state) => ({
            captcha: Object.assign({}, state.captcha, { value: token || "", valid: true }),
        }));
    }

    handleBlur(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.validateField(name, value);
    }

    handleKeyUp(event) {
        const name = event.target.name;
        const value = event.target.value;

        clearTimeout(this.typing);
        if (event.key !== "Tab") {
            const validateThisField = () => this.validateField(name, value);
            this.typing = setTimeout(validateThisField, 200);
        }
    }

    handleKeyDown() {
        clearTimeout(this.typing);
    }

    validateField(name, value) {
        const valid = this.isFieldValid(name, value);
        const newField = {
            valid: valid,
            errorMsg: valid ? "" : CONTACT_DEF[name].regex.error,
        };
        this.setState({ [name]: Object.assign({}, this.state[name], newField) });
    }

    isFieldValid(name, value) {
        if (CONTACT_DEF[name].hasOwnProperty("regex")) {
            return value.match(CONTACT_DEF[name].regex.def);
        }
        return true;
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: Object.assign({}, this.state[name], { value: value }) });
    }

    reset() {
        this.setState(JSON.parse(JSON.stringify(this.initialState)));
        // the widget isn't mounted once the message is sent
        if (this.captcha.current) this.captcha.current.reset();
    }

    isFormValid(emptyValuesOk = false) {
        for (let property in this.state)
            if (property !== "status")
                if (this.state.hasOwnProperty(property))
                    if (
                        !this.state[property].valid ||
                        (!emptyValuesOk && !this.state[property].value)
                    ) {
                        return false;
                    }
        return true;
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.isFormValid() || this.state.status !== "input") return;

        let mailContent = {};
        Object.keys(CONTACT_DEF).forEach((elem) => {
            mailContent[elem] = this.state[elem].value;
        });
        this.setState((state) => ({
            status: "loading",
            captcha: Object.assign({}, state.captcha, { errorMsg: "" }),
        }));
        postCallApi(CONTACT_URL, { mailContent, captcha: this.state.captcha.value }, false)
            .then((response) => {
                if (response.ok) {
                    this.reset();
                    this.setState({ status: "sent" });
                    return;
                }

                return response.json().then((jsonData) => {
                    // a refused captcha comes with a 400, other failures are unexpected
                    if (!jsonData.errors || !jsonData.errors.captcha) throw Error();
                    // the token was used by this submission, another one is needed
                    this.captcha.current.reset();
                    this.setState((state) => ({
                        status: "input",
                        captcha: Object.assign({}, state.captcha, {
                            valid: false,
                            errorMsg: jsonData.errors.captcha.message,
                        }),
                    }));
                });
            })
            .catch((error) => {
                if (this.captcha.current) this.captcha.current.reset();
                this.setState({ status: "input" });
                notify.error("Une erreur est survenue, veuillez réessayer : " + error);
            });
    }

    render() {
        const { status } = this.state;
        const fieldProps = (name) => ({
            required: true,
            name: name,
            label: upCaseFirstLetter(CONTACT_DEF[name].label),
            error: this.state[name].errorMsg || !this.state[name].valid,
            value: this.state[name].value,
            onBlur: this.handleBlur,
            onKeyUp: this.handleKeyUp,
            onKeyDown: this.handleKeyDown,
            onChange: this.handleChange,
        });

        if (status === "sent")
            return (
                <div className="form">
                    <Alert tone="success" title="Message envoyé !">
                        Ton message a bien été transmis, on te répond vite.
                    </Alert>
                    <div className="form__actions">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => this.setState({ status: "input" })}
                        >
                            Écrire un autre message
                        </button>
                    </div>
                </div>
            );

        return (
            <form className="form" onSubmit={this.handleSubmit} noValidate>
                <div className="form__row">
                    <Field {...fieldProps("firstname")} autoComplete="given-name" />
                    <Field {...fieldProps("lastname")} autoComplete="family-name" />
                </div>
                <div className="form__row">
                    <Field {...fieldProps("mail")} type="email" autoComplete="email" />
                    <Field {...fieldProps("phone")} type="tel" autoComplete="tel" />
                </div>
                <Field {...fieldProps("content")} as="textarea" />
                <div className="field">
                    <Captcha ref={this.captcha} onToken={this.handleCaptchaToken} />
                    {this.state.captcha.errorMsg && (
                        <span className="field__error">
                            <Icon name="alert" size={14} />
                            {this.state.captcha.errorMsg}
                        </span>
                    )}
                </div>
                <div className="form__actions">
                    <button
                        type="submit"
                        className="btn btn--primary btn--lg"
                        disabled={!this.isFormValid() || status !== "input"}
                    >
                        {status === "loading" ? "Envoi en cours…" : "Envoyer"}
                    </button>
                    <button type="button" className="btn btn--ghost btn--lg" onClick={this.reset}>
                        Réinitialiser
                    </button>
                </div>
            </form>
        );
    }
}

export default ContactForm;
