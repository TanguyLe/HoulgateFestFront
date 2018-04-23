import React from "react";
import {Form, Message, List, Icon} from 'semantic-ui-react';
import {CONTACT_URL, CONTACT_DEF} from "./constants";
import {postCallApi} from "../utils/api/fetchMiddleware";
import {upCaseFirstLetter} from "../utils/miscFcts";
import {withRouter} from "react-router-dom";

class ContactForm extends React.Component {
    constructor() {
        super();
        this.initialState = {};
        Object.keys(CONTACT_DEF).forEach((elem) => {
            this.initialState[elem] = {
                value: "",
                valid: true,
                errorMsg: ""
            }
        });
        this.state = JSON.parse(JSON.stringify(this.initialState));
        this.state.isMessageSent = false;
        this.state.isMessagePending = false;
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


    validateField(name, value) {
        const valid = this.isFieldValid(name, value);
        const newField = {
            valid: valid,
            errorMsg: valid ? "" : CONTACT_DEF[name].regex.error
        };
        this.setState({[name]: Object.assign({}, this.state[name], newField)});
    }


    isFieldValid(name, value) {
        if (CONTACT_DEF[name].hasOwnProperty('regex')) {
            return value.match(CONTACT_DEF[name].regex.def);
        }
        return true;
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: Object.assign({}, this.state[name], {value: value})});
    }

    reset() {
        this.setState(JSON.parse(JSON.stringify(this.initialState)));
    }

    isFormValid(emptyValuesOk = false) {
        for (let property in this.state)
            if ((property !== 'isMessageSent') && (property !== 'isMessagePending'))
                if (this.state.hasOwnProperty(property))
                    if (!this.state[property].valid || (!emptyValuesOk && !this.state[property].value)) {
                        return false;
                    }
        return true;
    }

    handleSubmit() {
        let mailContent = {};
        Object.keys(this.state).forEach((elem) => {
            mailContent[elem] = this.state[elem].value
        });
        this.setState({isMessagePending: true});
        postCallApi(CONTACT_URL, {mailContent}, false)
            .then((response) => {
                if (!response.ok)
                    throw Error();
                this.setState({isMessagePending: false, isMessageSent: true});
                setTimeout(this.reset());
                return response;
            })
            .catch(error => alert("Une erreur est survenue, veuillez réessayer :  " + error))
    }


    render() {
        const isFormValid = this.isFormValid(true);
        return (
            <Form error={!isFormValid} onSubmit={this.handleSubmit} onKeyPress={this.handleKeyPress}
                  success={this.state.isMessageSent}>
                {Object.keys(CONTACT_DEF).map((name, index) => {
                    if (CONTACT_DEF[name].htmlElem === 'Input')
                        return (
                            <Form.Input required
                                        error={!this.state[name].valid}
                                        type={CONTACT_DEF[name].type}
                                        key={index}
                                        fluid
                                        label={upCaseFirstLetter(CONTACT_DEF[name].label)}
                                        name={name}
                                        value={this.state[name].value}
                                        onBlur={this.handleBlur}
                                        onKeyUp={this.handleKeyUp}
                                        onKeyDown={this.handleKeyDown}
                                        onChange={this.handleChange}/>
                        );
                    else if (CONTACT_DEF[name].htmlElem === 'TextArea')
                        return (
                            <Form.TextArea required
                                           error={!this.state[name].valid}
                                           type={CONTACT_DEF[name].type}
                                           key={index}
                                           label={upCaseFirstLetter(CONTACT_DEF[name].label)}
                                           name={name}
                                           value={this.state[name].value}
                                           onBlur={this.handleBlur}
                                           onKeyUp={this.handleKeyUp}
                                           onKeyDown={this.handleKeyDown}
                                           onChange={this.handleChange}/>
                        );

                })}
                <Form.Group inline>
                    <Form.Button type="submit" disabled={!this.isFormValid() || this.state.isMessagePending}
                                 onClick={this.handleSubmit}>Envoyer</Form.Button>
                    <Form.Button type="reset" onClick={this.reset}>Réinitialiser</Form.Button>
                </Form.Group>
                <Message error>
                    <List bulleted>
                        {Object.keys(this.state).map(key => {
                            const errorMsg = this.state[key].errorMsg;
                            if (errorMsg)
                                return <List.Item key={key}>{errorMsg}</List.Item>

                        })}
                    </List>
                </Message>
                <Message success>
                    Ton message a bien été transmis !
                </Message>
                <Message info icon hidden={!this.state.isMessagePending}>
                    <Icon name='circle notched' loading/>
                    <Message.Content>
                        Envoi du message en cours..
                    </Message.Content>
                </Message>

            </Form>
        );
    }
}

export default withRouter(ContactForm);
