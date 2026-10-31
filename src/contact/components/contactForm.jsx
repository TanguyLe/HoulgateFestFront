import React from "react";
import { CONTACT_URL, CONTACT_DEF } from "../constants";
import { postCallApi } from "../../utils/api/fetchMiddleware";
import { upCaseFirstLetter } from "../../utils/miscFcts";
import Captcha from "../../utils/captcha";
import { Callout, ErrorList, Field, Spinner } from "../../ui";

const AUTOCOMPLETE = {
    mail: "email",
    firstname: "given-name",
    lastname: "family-name",
    phone: "tel",
};

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
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.reset = this.reset.bind(this);
        this.handleCaptchaToken = this.handleCaptchaToken.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Enter in a field submits the form through its submit button, when it's enabled
    onSubmit(event) {
        event.preventDefault();
        if (this.isFormValid() && this.state.status === "input") this.handleSubmit();
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

    handleKeyPress(event) {
        if (this.isFormValid() && event.key === "Enter") this.handleSubmit();
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
        this.captcha.current.reset();
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

    handleSubmit() {
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
                    this.setState({ status: "sent" });
                    this.reset();
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
                this.captcha.current.reset();
                this.setState({ status: "input" });
                alert("Une erreur est survenue, veuillez réessayer :  " + error);
            });
    }

    render() {
        const loading = this.state.status === "loading";

        return (
            <form className="form" onSubmit={this.onSubmit} noValidate>
                {Object.keys(CONTACT_DEF).map((name, index) => (
                    <Field
                        required
                        multiline={CONTACT_DEF[name].htmlElem === "TextArea"}
                        error={!this.state[name].valid}
                        type={
                            CONTACT_DEF[name].htmlElem === "Input"
                                ? CONTACT_DEF[name].type
                                : undefined
                        }
                        key={"formKey" + index}
                        label={upCaseFirstLetter(CONTACT_DEF[name].label)}
                        name={name}
                        autoComplete={AUTOCOMPLETE[name]}
                        value={this.state[name].value}
                        onBlur={this.handleBlur}
                        onKeyUp={this.handleKeyUp}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleChange}
                    />
                ))}
                <div className="field">
                    <Captcha ref={this.captcha} onToken={this.handleCaptchaToken} />
                </div>
                <ErrorList
                    messages={Object.keys(this.state)
                        .filter((key) => key !== "status")
                        .map((key) => this.state[key].errorMsg)}
                />
                {this.state.status === "sent" && (
                    <Callout kind="success" icon="💌">
                        Ton message a bien été transmis !
                    </Callout>
                )}
                <div className="form__actions">
                    <button
                        type="submit"
                        className="btn btn--primary btn--lg"
                        disabled={!this.isFormValid() || this.state.status !== "input"}
                    >
                        {loading && <Spinner />}
                        {loading ? "Envoi du message en cours.." : "Envoyer"}
                    </button>
                    <button type="reset" className="btn btn--ghost" onClick={this.reset}>
                        Réinitialiser
                    </button>
                </div>
            </form>
        );
    }
}

export default ContactForm;
