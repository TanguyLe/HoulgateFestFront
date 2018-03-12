/* @flow */
import React from "react";
import {Form} from "semantic-ui-react"


import {NAME, TYPE, SIGN_UP_FORM_BLOCK_INDEX_PREFIX, REGISTER_URL, SIGN_UP_DEF} from "../constants";
import {login} from "../store"
import {upCaseFirstLetter} from "../../utils/miscFcts"
import {postCallApi} from "../../utils/api/fetchMiddleware";


class SignUpForm extends React.Component {
    constructor() {
        super();

        this.state = {};
        this.initialState = {};

        SIGN_UP_DEF.forEach((elem) => {
            Object.assign(this.initialState, {[elem[NAME]]: ""})
        });

        Object.assign(this.state, this.initialState);

        this.handleChange = this.handleChange.bind(this);
        this.onClickReset = this.onClickReset.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    onClickReset() {
        this.setState(this.initialState);
    }

    onClickSubmit() {
        postCallApi(REGISTER_URL, this.state, false)
            .then((response) => {
                if (!response.ok)
                    throw Error("requête");
                return response;
            })
            .then((response) => response.json())
            .then((jsonData) => {
                login(jsonData.username, jsonData.accessToken, jsonData.refreshToken);
            })
            .catch(error => alert(error))
            .then(() => this.onClickReset());
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                {SIGN_UP_DEF.map((elem, index) => {
                    let name = elem[NAME];
                    return (
                        <Form.Input required
                                    key={SIGN_UP_FORM_BLOCK_INDEX_PREFIX + index}
                                    type={elem[TYPE]}
                                    fluid
                                    label={upCaseFirstLetter(name)}
                                    name={name}
                                    value={this.state[name]}
                                    onChange={this.handleChange}/>
                    )
                })}
            <Form.Group inline>
                <Form.Button type="submit" onClick={this.onClickSubmit}>Inscription</Form.Button>
                <Form.Button type="reset" onClick={this.onClickReset}>Reset</Form.Button>
            </Form.Group>
            </Form>
        );
    }
}

export default SignUpForm;
