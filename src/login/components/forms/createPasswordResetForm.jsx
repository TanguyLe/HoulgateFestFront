import React from "react";

import {
    NAME,
    TYPE,
    CREATE_PSWRD_RESET_BLOCK_INDEX_PREFIX,
    LABEL,
    PSWD_RESET_URL,
    CREATE_PSWRD_RESET_DEF,
    REGEXES,
    ERROR_MSG,
    CONFIRM,
} from "../../constants";
import { UNKNOWN_ERROR_MSG } from "../../../labels";
import { Button, Notice, TextField, showError } from "../../../ui";
import { upCaseFirstLetter } from "../../../utils/miscFcts";
import { postCallApi } from "../../../utils/api/fetchMiddleware";

class CreatePasswordResetForm extends React.Component {
    constructor() {
        super();

        this.initialState = {};

        CREATE_PSWRD_RESET_DEF.forEach((elem) => {
            this.initialState[elem[NAME]] = {
                value: "",
                valid: true,
                errorMsg: "",
            };
        });

        this.typing = () => {};

        this.state = JSON.parse(JSON.stringify(this.initialState));
        this.state.status = "input";

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
                if (property !== "status" && property !== "notActivated")
                    if (
                        !this.state[property].valid ||
                        (!emptyValuesOk && !this.state[property].value)
                    )
                        return false;

        return true;
    }

    handleClickSubmit() {
        let formValues = {};

        CREATE_PSWRD_RESET_DEF.forEach((elem) => {
            formValues[elem[NAME]] = this.state[elem[NAME]].value;
        });

        let failure = false;
        this.setState({ status: "loading", notActivated: false });

        postCallApi(PSWD_RESET_URL, formValues, false)
            .then((response) => {
                if (!response.ok) failure = true;
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                if (failure) {
                    this.setState(
                        Object.assign(
                            {},
                            this.state,
                            { status: "input" },
                            {
                                [jsonData.wrongField]: Object.assign(
                                    {},
                                    this.state[jsonData.wrongField],
                                    {
                                        valid: false,
                                        errorMsg: jsonData.message,
                                    },
                                ),
                            },
                        ),
                    );

                    if (jsonData.wrongField === "activation") this.setState({ notActivated: true });
                } else this.setState({ status: "sent" });
            })
            .catch((error) => {
                this.setState({ status: "input" });
                showError(UNKNOWN_ERROR_MSG);
            });
    }

    validateField(name, value) {
        const valid = this.isFieldValid(name, value);
        const newField = {
            valid: valid,
            errorMsg: valid
                ? ""
                : CREATE_PSWRD_RESET_DEF.find((elem) => elem[NAME] === name)[ERROR_MSG],
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
        if (this.state.status === "sent")
            return (
                <Notice tone="success" title="Mail envoyé">
                    Nous venons de t'envoyer un mail pour changer ton mot de passe !
                </Notice>
            );

        return (
            <form
                className="form"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    if (this.isFormValid() && this.state.status === "input")
                        this.handleClickSubmit();
                }}
            >
                {this.state.notActivated && (
                    <Notice tone="warning" title="Ton compte n'est pas activé">
                        Utilise le lien que tu as reçu par mail à l'inscription.
                    </Notice>
                )}
                {CREATE_PSWRD_RESET_DEF.map((elem, index) => {
                    const name = elem[NAME];
                    return (
                        <TextField
                            required
                            key={CREATE_PSWRD_RESET_BLOCK_INDEX_PREFIX + index}
                            type="email"
                            label={upCaseFirstLetter(elem[LABEL])}
                            name={name}
                            autoComplete="email"
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
                    <Button
                        type="submit"
                        loading={this.state.status === "loading"}
                        disabled={!this.isFormValid() || this.state.status !== "input"}
                    >
                        Recevoir le mail
                    </Button>
                </div>
            </form>
        );
    }
}

export default CreatePasswordResetForm;
