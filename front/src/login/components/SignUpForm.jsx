/* @flow */
import React from "react";

import Button from "../../utils/basics/Button/index";
import Block from "../../utils/basics/Block/index";
import TextBlock from "../../utils/basics/TextBlock/index";
import Wrapper from "../../utils/basics/Wrapper/index";
import {NAME, TYPE, SIGN_UP_FORM_BLOCK_INDEX_PREFIX, signUpDef} from "../constants";
import {upCaseFirstLetter} from "../../utils/miscFcts"


class SignUpForm extends React.Component {
    constructor() {
        super();

        this.state = {};
        signUpDef.forEach((elem) => {
            Object.assign(this.state, {[elem[NAME]]: ""})
        });

        this.handleChange = this.handleChange.bind(this);
        this.onClickReset = this.onClickReset.bind(this);
    }

    onClickReset() {
        this.setState({
            email: "",
            name: "",
            password: "",
            confirm: ""
        });
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
                                this.state.name,
                                " password: ",
                                this.state.password,
                                " confirm: ",
                                this.state.confirm
                            ]);
                            /* Call something from props here*/
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
