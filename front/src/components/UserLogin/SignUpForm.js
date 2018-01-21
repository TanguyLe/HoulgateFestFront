/* @flow */
import React, { Component } from "react";
import Button from "../basics/Button";
import Block from "../basics/Block";
import TextBlock from "../basics/TextBlock";
import Wrapper from "../basics/Wrapper";

class SignUpForm extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Wrapper column /*style={{ ...this.props.style }}*/>
        <Block padding={"small"}>
          <TextBlock weight={"bold"} padding={"small"}>
            Email:
          </TextBlock>
          <input
            onChange={() =>
              this.setState({
                email: this.mailInput.value,
                name: this.nameInput.value,
                password: this.pwInput.value
              })
            }
            ref={node => {
              this.mailInput = node;
            }}
          />
        </Block>
        <Block padding={"small"}>
          <TextBlock weight={"bold"} padding={"small"}>
            Name:
          </TextBlock>
          <input
            onChange={() =>
              this.setState({
                email: this.mailInput.value,
                name: this.nameInput.value,
                password: this.pwInput.value
              })
            }
            ref={node => {
              this.nameInput = node;
            }}
          />
        </Block>
        <Block padding={"small"}>
          <TextBlock weight={"bold"} padding={"small"}>
            Password:
          </TextBlock>
          <input
            onChange={() =>
              this.setState({
                email: this.mailInput.value,
                name: this.nameInput.value,
                password: this.pwInput.value
              })
            }
            ref={node => {
              this.pwInput = node;
            }}
          />
        </Block>
        <Block>
          <Button onClick={this.props.onClick}>Send</Button>
          <Button
            onClick={() => {
              this.mailInput.value = "";
              this.nameInput.value = "";
              this.pwInput.value = "";

              this.setState({
                email: "",
                name: "",
                password: ""
              });
            }}
          >
            Reset
          </Button>
        </Block>
      </Wrapper>
    );
  }
}

export default SignUpForm;
