import React from "react";

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
import CaptchaField from "../../../utils/captchaField";
import { Button, TextField, showError } from "../../../ui";

const AUTOCOMPLETE = {
    email: "email",
    username: "username",
    password: "new-password",
    confirm: "new-password",
};

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
                showError(UNKNOWN_ERROR_MSG);
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
            <form
                className="form"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    if (this.isFormValid()) this.handleClickSubmit();
                }}
            >
                {SIGN_UP_DEF.map((elem, index) => {
                    const name = elem[NAME];
                    return (
                        <TextField
                            required
                            key={SIGN_UP_FORM_BLOCK_INDEX_PREFIX + index}
                            type={name === "email" ? "email" : elem[TYPE]}
                            label={upCaseFirstLetter(elem[LABEL])}
                            name={name}
                            autoComplete={AUTOCOMPLETE[name]}
                            value={this.state[name].value}
                            error={this.state[name].valid ? "" : this.state[name].errorMsg}
                            onBlur={this.handleBlur}
                            onKeyUp={this.handleKeyUp}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                        />
                    );
                })}
                <CaptchaField
                    ref={this.captcha}
                    onToken={this.handleCaptchaToken}
                    error={this.state.captcha.errorMsg}
                />
                <div className="form__actions">
                    <Button type="submit" disabled={!this.isFormValid()}>
                        Créer mon compte
                    </Button>
                    <Button type="reset" variant="text" onClick={this.handleClickReset}>
                        Effacer
                    </Button>
                </div>
            </form>
        );
    }
}

export default SignUpForm;
