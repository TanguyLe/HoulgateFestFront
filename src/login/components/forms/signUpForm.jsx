import React from "react";
import { Form, Message, List } from "semantic-ui-react";

import {
    NAME,
    TYPE,
    SIGN_UP_FORM_BLOCK_INDEX_PREFIX,
    LABEL,
    SIGN_UP_DEF,
    REGEXES,
    ERROR_MSG,
    REGISTRATION_ERROR_MSG_PREFIX,
} from "../../constants";
import { USERS_ENDPOINT } from "../../../constants";
import { upCaseFirstLetter } from "../../../utils/miscFcts";
import { postCallApi } from "../../../utils/api/fetchMiddleware";
import { UNKNOWN_ERROR_MSG } from "../../../labels";

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

        this.typing = () => {};

        this.state = JSON.parse(JSON.stringify(this.initialState));

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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

        postCallApi(USERS_ENDPOINT, formValues, false)
            .then((response) => {
                if (!response.ok) throw Error();
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                if (!jsonData.errors && !jsonData.errmsg) {
                    this.props.onRegistration("registered");
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
            .catch((error) => alert(UNKNOWN_ERROR_MSG + error));
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

    handleKeyPress(event) {
        if (this.isFormValid() && event.key === "Enter") this.handleClickSubmit();
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
        const isFormValid = this.isFormValid(true);

        return (
            <Form
                error={!isFormValid}
                onSubmit={this.handleSubmit}
                onKeyPress={this.handleKeyPress}
            >
                {SIGN_UP_DEF.map((elem, index) => {
                    let name = elem[NAME];
                    return (
                        <Form.Input
                            required
                            error={!this.state[name].valid}
                            key={SIGN_UP_FORM_BLOCK_INDEX_PREFIX + index}
                            type={elem[TYPE]}
                            fluid
                            label={upCaseFirstLetter(elem[LABEL])}
                            name={name}
                            value={this.state[name].value}
                            onBlur={this.handleBlur}
                            onKeyUp={this.handleKeyUp}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                        />
                    );
                })}
                <Form.Group inline>
                    <Form.Button
                        type="submit"
                        disabled={!this.isFormValid()}
                        onClick={this.handleClickSubmit}
                    >
                        Inscription
                    </Form.Button>
                    <Form.Button type="reset" onClick={this.handleClickReset}>
                        Reset
                    </Form.Button>
                </Form.Group>
                <Message error>
                    <List bulleted>
                        {Object.keys(this.state).map((key) => {
                            const errorMsg = this.state[key].errorMsg;

                            if (errorMsg)
                                return (
                                    <List.Item key={REGISTRATION_ERROR_MSG_PREFIX + key}>
                                        {errorMsg}
                                    </List.Item>
                                );
                        })}
                    </List>
                </Message>
            </Form>
        );
    }
}

export default SignUpForm;
