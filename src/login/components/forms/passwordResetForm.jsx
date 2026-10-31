import React from "react";

import {
    NAME,
    TYPE,
    PSWRD_RESET_BLOCK_INDEX_PREFIX,
    LABEL,
    RESET_PSWRD_DEF,
    REGEXES,
    ERROR_MSG,
    CONFIRM,
} from "../../constants";
import { upCaseFirstLetter } from "../../../utils/miscFcts";
import { putCallApi } from "../../../utils/api/fetchMiddleware";
import { UNKNOWN_ERROR_MSG } from "../../../labels";
import { Button, Notice, TextField, showError } from "../../../ui";

class PasswordResetForm extends React.Component {
    constructor() {
        super();

        this.initialState = {};

        RESET_PSWRD_DEF.forEach((elem) => {
            this.initialState[elem[NAME]] = {
                value: "",
                valid: true,
                errorMsg: "",
            };
        });

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
    }

    resetState() {
        this.setState(JSON.parse(JSON.stringify(this.initialState)));
    }

    handleClickReset() {
        this.resetState();
    }

    isFieldValid(name, value) {
        if (name === CONFIRM) return value === this.state.password.value;

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

        putCallApi(this.props.resetUrl, formValues, false)
            .then((response) => {
                if (!response.ok) throw Error();
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                if (!jsonData.errors && !jsonData.errmsg) {
                    this.props.onPasswordChanged();
                } else {
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
            .catch(() => showError(UNKNOWN_ERROR_MSG));
    }

    validateField(name, value) {
        const valid = this.isFieldValid(name, value);
        const newField = {
            valid: valid,
            errorMsg: valid ? "" : RESET_PSWRD_DEF.find((elem) => elem[NAME] === name)[ERROR_MSG],
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
        if (!this.props.resetUrl)
            return (
                <Notice tone="error" title="Lien incomplet">
                    Ce lien de changement de mot de passe n'est pas valide : utilise celui reçu par
                    mail.
                </Notice>
            );

        return (
            <form
                className="form"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    if (this.isFormValid()) this.handleClickSubmit();
                }}
            >
                {RESET_PSWRD_DEF.map((elem, index) => {
                    const name = elem[NAME];
                    return (
                        <TextField
                            required
                            key={PSWRD_RESET_BLOCK_INDEX_PREFIX + index}
                            type={elem[TYPE]}
                            label={upCaseFirstLetter(elem[LABEL])}
                            name={name}
                            autoComplete="new-password"
                            value={this.state[name].value}
                            error={this.state[name].valid ? "" : this.state[name].errorMsg}
                            onBlur={this.handleBlur}
                            onKeyUp={this.handleKeyUp}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                        />
                    );
                })}
                <div className="form__actions">
                    <Button type="submit" disabled={!this.isFormValid()}>
                        Changer de mot de passe
                    </Button>
                </div>
            </form>
        );
    }
}

export default PasswordResetForm;
