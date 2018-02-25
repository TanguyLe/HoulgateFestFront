/* @flow */
import React from "react";

import Button from "../../utils/basics/Button/index";
import Block from "../../utils/basics/Block/index";
import TextBlock from "../../utils/basics/TextBlock/index";
import Wrapper from "../../utils/basics/Wrapper/index";
import {NAME, TYPE, SIGN_UP_FORM_BLOCK_INDEX_PREFIX, REGISTER_URL, LOGIN_URL, signUpDef} from "../constants";
import {login} from "../store"
import {upCaseFirstLetter} from "../../utils/miscFcts"
import {postCallApi} from "../../utils/api/fetchMiddleware";


class SignUpForm extends React.Component {
    constructor() {
        super();

        this.state = {};
        signUpDef.forEach((elem) => {
            Object.assign(this.state, {[elem[NAME]]: ""})
        });

        this.handleChange = this.handleChange.bind(this);
        this.onClickReset = this.onClickReset.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    onClickReset() {
        this.setState({
            email: "",
            username: "",
            password: "",
            confirm: ""
        });
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
                alert("Login successfull " + jsonData.username + " !");
            })
            .catch(error => alert(error))
            .then(() => this.onClickReset());
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <Wrapper column style={{...this.props.style}}>
                {signUpDef.map((elem, index) => {
                    let name = elem[NAME];
                    return (
                        <Block padding={"small"} key={SIGN_UP_FORM_BLOCK_INDEX_PREFIX + index}>
                            <TextBlock weight={"bold"} padding={"small"}>
                                {upCaseFirstLetter(name)}:
                            </TextBlock>
                            <input
                                   type={elem[TYPE]} value={this.state[name]}
                                   name={name}
                                   onChange={this.handleChange}/>
                        </Block>
                    )
                })}
                <Block>
                    <Button
                        color={this.state.password === this.state.confirm ? "green" : "red"}
                        onClick={() => {
                            alert([
                                "email: ",
                                this.state.email,
                                " name: ",
                                this.state.username,
                                " password: ",
                                this.state.password,
                                " confirm: ",
                                this.state.confirm
                            ]);
                            this.onClickSubmit();
                        }}
                    >
                        Send
                    </Button>
                    <Button onClick={this.onClickReset}>
                        Reset
                    </Button>
                </Block>
            </Wrapper>
        );
    }
}

export default SignUpForm;
