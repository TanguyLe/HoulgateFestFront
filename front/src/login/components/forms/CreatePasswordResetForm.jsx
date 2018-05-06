/* @flow */
import React from "react";
import {Icon, Form, Message, List} from "semantic-ui-react"


import {
    NAME, TYPE, CREATE_PSWRD_RESET_BLOCK_INDEX_PREFIX, LABEL, PSWD_RESET_URL,
    CREATE_PSWRD_RESET_DEF, REGEXES, ERROR_MSG, CREATE_PSWRD_RESET_ERROR_MSG_PREFIX, CONFIRM
} from "../../constants";
import {upCaseFirstLetter} from "../../../utils/miscFcts"
import {postCallApi} from "../../../utils/api/fetchMiddleware";


class CreatePasswordResetForm extends React.Component {
    constructor() {
        super();

        this.initialState = {};

        CREATE_PSWRD_RESET_DEF.forEach((elem) => {
            this.initialState[elem[NAME]] = {
                value: "",
                valid: true,
                errorMsg: ""
            }
        });

        this.typing = () => {
        };

        this.state = JSON.parse(JSON.stringify(this.initialState));
        this.state.status = "input";

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
        this.setState(JSON.parse(JSON.stringify(this.initialState)))
    }

    handleClickReset() {
        this.resetState();
    }

    isFieldValid(name, value) {
        if (name === CONFIRM)
            return value === this.state.password.value;

        if (name in REGEXES)
            return value.match(REGEXES[name]);

        return true;
    }

    isFormValid(emptyValuesOk = false) {
        for (let property in this.state)
            if (this.state.hasOwnProperty(property))
                if (property !== 'status')
                    if (!this.state[property].valid || (!emptyValuesOk && !this.state[property].value))
                        return false;

        return true;
    }

    handleClickSubmit() {
        let formValues = {};

        Object.keys(this.state).map(key => {
            formValues[key] = this.state[key].value
        });

        let failure = false;
        this.setState({status: 'loading'});

        postCallApi(PSWD_RESET_URL, formValues, false)
            .then((response) => {
                if (!response.ok)
                    failure = true;
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                if (failure) {
                    this.setState(Object.assign({}, this.state, {status: "input"},
                        {
                            [jsonData.wrongField]: Object.assign({}, this.state[jsonData.wrongField], {
                                valid: false,
                                errorMsg: jsonData.message
                            })
                        }));

                    if (jsonData.wrongField === "activation")
                        alert("Le compte n'est pas activé! Veuillez utiliser le lien que vous avez reçu par mail.");
                }
                else
                    this.setState({status: "sent"});
            }).catch(error => {
            this.setState({status: "input"});
            alert("Erreur inattendue, veuillez vérifier l'état de votre connexion internet. " + error)
        })
    }

    validateField(name, value) {
        const valid = this.isFieldValid(name, value);
        const newField = {
            valid: valid,
            errorMsg: valid ? "" : CREATE_PSWRD_RESET_DEF.find(elem => elem[NAME] === name)[ERROR_MSG]
        };

        this.setState({[name]: Object.assign({}, this.state[name], newField)});
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({[name]: Object.assign({}, this.state[name], {value: value})});
    }

    handleBlur(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.validateField(name, value)
    }

    handleKeyPress(event) {
        if (this.isFormValid() && event.key === "Enter")
            this.handleClickSubmit();
    }

    handleKeyUp(event) {
        const name = event.target.name;
        const value = event.target.value;

        clearTimeout(this.typing);
        if (event.key !== "Tab") {
            const validateThisField = () => this.validateField(name, value);
            this.typing = setTimeout(validateThisField, 200)
        }
    }

    handleKeyDown() {
        clearTimeout(this.typing);
    }

    render() {
        const isFormValid = this.isFormValid(true);

        return (
            <Form error={!isFormValid} onSubmit={this.handleSubmit} success={this.state.status === 'sent'}
                  onKeyPress={this.handleKeyPress}>
                {CREATE_PSWRD_RESET_DEF.map((elem, index) => {
                    let name = elem[NAME];
                    return (
                        <Form.Input required
                                    error={!this.state[name].valid}
                                    key={CREATE_PSWRD_RESET_BLOCK_INDEX_PREFIX + index}
                                    type={elem[TYPE]}
                                    fluid
                                    label={upCaseFirstLetter(elem[LABEL])}
                                    name={name}
                                    value={this.state[name].value}
                                    onBlur={this.handleBlur}
                                    onKeyUp={this.handleKeyUp}
                                    onKeyDown={this.handleKeyDown}
                                    onChange={this.handleChange}/>
                    )
                })}
                <Form.Group inline>
                    <Form.Button type="submit" disabled={!this.isFormValid() || (this.state.status !== 'input')}
                                 onClick={this.handleClickSubmit}>Envoi du mail</Form.Button>
                </Form.Group>
                <Message error>
                    <List bulleted>
                        {Object.keys(this.state).map(key => {
                            const errorMsg = this.state[key].errorMsg;

                            if (errorMsg)
                                return <List.Item key={CREATE_PSWRD_RESET_ERROR_MSG_PREFIX + key}>{errorMsg}</List.Item>
                        })}
                    </List>
                </Message>
                <Message success>
                    Nous venons de t'envoyer un mail pour changer ton mot de passe!
                </Message>
                <Message info icon hidden={this.state.status !== 'loading'}>
                    <Icon name='circle notched' loading/>
                    <Message.Content>
                        Envoi du mail en cours...
                    </Message.Content>
                </Message>
            </Form>
        );
    }
}

export default CreatePasswordResetForm;
