import React from "react";
import { Field } from "../../../ui/components";
import Icon from "../../../ui/icon";
import { notify } from "../../../ui/toast";

import {
    NAME,
    TYPE,
    SIGN_UP_FORM_BLOCK_INDEX_PREFIX,
    LABEL,
    SIGN_UP_DEF,
    REGEXES,
    ERROR_MSG,
} from "../../constants";
import { USERS_ENDPOINT } from "../../../constants";
import { upCaseFirstLetter } from "../../../utils/miscFcts";
import { postCallApi } from "../../../utils/api/fetchMiddleware";
import { UNKNOWN_ERROR_MSG } from "../../../labels";
import Captcha from "../../../utils/captcha";

class SignUpForm extends React.Component {
    constructor() {
        super();

        this.initialState = {};

        SIGN_UP_DEF.forEach((elem) => {
            this.initialState[elem[NAME]] = {
                value: "",
                valid: true,
                errorMsg: "",
            };
        });
        // the captcha token is sent and checked by the back like the other fields
        this.initialState.captcha = { value: "", valid: true, errorMsg: "" };

        this.captcha = React.createRef();
        this.typing = () => {};

        this.state = JSON.parse(JSON.stringify(this.initialState));

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClickReset = this.handleClickReset.bind(this);
        this.handleClickSubmit = this.handleClickSubmit.bind(this);
        this.validateField = this.validateField.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.isFieldValid = this.isFieldValid.bind(this);
        this.handleCaptchaToken = this.handleCaptchaToken.bind(this);
    }

    resetState() {
        this.setState(JSON.parse(JSON.stringify(this.initialState)));
    }

    handleClickReset() {
        this.resetState();
        this.captcha.current.reset();
    }

    handleCaptchaToken(token) {
        // the error of the last submission stays displayed until the next one
        this.setState((state) => ({
            captcha: Object.assign({}, state.captcha, { value: token || "", valid: true }),
        }));
    }

    isFieldValid(name, value) {
        if (name === "confirm") return value === this.state.password.value;

        if (name in REGEXES) return value.match(REGEXES[name]);

        return true;
    }

    isFormValid(emptyValuesOk = false) {
        for (let property in this.state)
            if (this.state.hasOwnProperty(property))
                if (!this.state[property].valid || (!emptyValuesOk && !this.state[property].value))
                    return false;

        return true;
    }

    handleClickSubmit() {
        const formValues = {};

        Object.keys(this.state).map((key) => {
            formValues[key] = this.state[key].value;
        });

        this.setState((state) => ({
            captcha: Object.assign({}, state.captcha, { errorMsg: "" }),
        }));

        postCallApi(USERS_ENDPOINT, formValues, false)
            .then((response) =>
                response.json().then((jsonData) => {
                    // refused fields come with a 400, other failures are unexpected
                    if (!response.ok && !jsonData.errors) throw Error();
                    return jsonData;
                }),
            )
            .then((jsonData) => {
                if (!jsonData.errors && !jsonData.errmsg) {
                    this.props.onRegistration("registered");
                } else {
                    // the token was used by this submission, another one is needed
                    this.captcha.current.reset();
                    let newState = {};
                    Object.keys(jsonData.errors).map((key) => {
                        Object.assign(newState, {
                            [key]: Object.assign({}, this.state[key], {
                                valid: false,
                                errorMsg: jsonData.errors[key].message,
                            }),
                        });
                    });
                    this.setState(newState);
                }
            })
            .catch((error) => {
                this.captcha.current.reset();
                notify.error(UNKNOWN_ERROR_MSG + error);
            });
    }

    validateField(name, value) {
        const valid = this.isFieldValid(name, value);
        const newField = {
            valid: valid,
            errorMsg: valid ? "" : SIGN_UP_DEF.find((elem) => elem[NAME] === name)[ERROR_MSG],
        };

        this.setState({ [name]: Object.assign({}, this.state[name], newField) });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: Object.assign({}, this.state[name], { value: value }) });
    }

    handleBlur(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.validateField(name, value);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.isFormValid()) this.handleClickSubmit();
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

    render() {
        return (
            <form className="form" onSubmit={this.handleSubmit} noValidate>
                {SIGN_UP_DEF.map((elem, index) => {
                    const name = elem[NAME];
                    return (
                        <Field
                            required
                            key={SIGN_UP_FORM_BLOCK_INDEX_PREFIX + index}
                            error={this.state[name].errorMsg || !this.state[name].valid}
                            type={elem[TYPE]}
                            label={upCaseFirstLetter(elem[LABEL])}
                            name={name}
                            autoFocus={index === 0}
                            value={this.state[name].value}
                            onBlur={this.handleBlur}
                            onKeyUp={this.handleKeyUp}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                        />
                    );
                })}
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
                        disabled={!this.isFormValid()}
                    >
                        Créer mon compte
                    </button>
                    <button
                        type="button"
                        className="btn btn--ghost btn--lg"
                        onClick={this.handleClickReset}
                    >
                        Réinitialiser
                    </button>
                </div>
            </form>
        );
    }
}

export default SignUpForm;
