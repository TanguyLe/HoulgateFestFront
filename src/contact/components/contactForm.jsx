import React from "react";
import { Form, Message, List, Icon } from "semantic-ui-react";
import { CONTACT_URL, CONTACT_DEF } from "../constants";
import { postCallApi } from "../../utils/api/fetchMiddleware";
import { upCaseFirstLetter } from "../../utils/miscFcts";
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
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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
        const isFormValid = this.isFormValid(true);
        return (
            <Form
                error={!isFormValid}
                onSubmit={this.handleSubmit}
                onKeyPress={this.handleKeyPress}
                success={this.state.status === "sent"}
            >
                {Object.keys(CONTACT_DEF).map((name, index) => {
                    if (CONTACT_DEF[name].htmlElem === "Input")
                        return (
                            <Form.Input
                                required
                                error={!this.state[name].valid}
                                type={CONTACT_DEF[name].type}
                                key={"formKey" + index}
                                fluid
                                label={upCaseFirstLetter(CONTACT_DEF[name].label)}
                                name={name}
                                value={this.state[name].value}
                                onBlur={this.handleBlur}
                                onKeyUp={this.handleKeyUp}
                                onKeyDown={this.handleKeyDown}
                                onChange={this.handleChange}
                            />
                        );
                    else if (CONTACT_DEF[name].htmlElem === "TextArea")
                        return (
                            <Form.TextArea
                                required
                                error={!this.state[name].valid}
                                type={CONTACT_DEF[name].type}
                                key={"formKey" + index}
                                label={upCaseFirstLetter(CONTACT_DEF[name].label)}
                                name={name}
                                value={this.state[name].value}
                                onBlur={this.handleBlur}
                                onKeyUp={this.handleKeyUp}
                                onKeyDown={this.handleKeyDown}
                                onChange={this.handleChange}
                            />
                        );
                })}
                <Form.Field>
                    <Captcha ref={this.captcha} onToken={this.handleCaptchaToken} />
                </Form.Field>
                <Form.Group inline>
                    <Form.Button
                        type="submit"
                        disabled={!this.isFormValid() || this.state.status !== "input"}
                    >
                        Envoyer
                    </Form.Button>
                    <Form.Button type="reset" onClick={this.reset}>
                        Réinitialiser
                    </Form.Button>
                </Form.Group>
                <Message error>
                    <List bulleted>
                        {Object.keys(this.state).map((key) => {
                            const errorMsg = this.state[key].errorMsg;
                            if (errorMsg)
                                return <List.Item key={"messageKey" + key}>{errorMsg}</List.Item>;
                        })}
                    </List>
                </Message>
                <Message success>Ton message a bien été transmis !</Message>
                <Message info icon hidden={this.state.status !== "loading"}>
                    <Icon name="circle notched" loading />
                    <Message.Content>Envoi du message en cours..</Message.Content>
                </Message>
            </Form>
        );
    }
}

export default ContactForm;
