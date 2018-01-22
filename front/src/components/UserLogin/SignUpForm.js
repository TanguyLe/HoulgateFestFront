/* @flow */
import React, { Component } from "react";
import Button from "../basics/Button";
import Block from "../basics/Block";
import TextBlock from "../basics/TextBlock";
import Wrapper from "../basics/Wrapper";

class SignUpForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			name: "",
			password: "",
			confirm: ""
		};
	}
	render() {
		return (
			<Wrapper column style={{ ...this.props.style }}>
				<Block padding={"small"}>
					<TextBlock weight={"bold"} padding={"small"}>
						Email:
					</TextBlock>
					<input
						onChange={() =>
							this.setState({
								email: this.mailInput.value,
								name: this.nameInput.value,
								password: this.pwInput.value,
								confirm: this.pwConfirm.value
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
								password: this.pwInput.value,
								confirm: this.pwConfirm.value
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
						type={"password"}
						onChange={() =>
							this.setState({
								email: this.mailInput.value,
								name: this.nameInput.value,
								password: this.pwInput.value,
								confirm: this.pwConfirm.value
							})
						}
						ref={node => {
							this.pwInput = node;
						}}
					/>
				</Block>
				<Block padding={"small"}>
					<TextBlock weight={"bold"} padding={"small"}>
						Confirm password:
					</TextBlock>
					<input
						type={"password"}
						onChange={() =>
							this.setState({
								email: this.mailInput.value,
								name: this.nameInput.value,
								password: this.pwInput.value,
								confirm: this.pwConfirm.value
							})
						}
						ref={node => {
							this.pwConfirm = node;
						}}
					/>
				</Block>
				<Block>
					<Button
						color={
							this.state.password == this.state.confirm
								? "green"
								: "red"
						}
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
							this.props.onClick;
						}}
					>
						Send
					</Button>
					<Button
						onClick={() => {
							this.mailInput.value = "";
							this.nameInput.value = "";
							this.pwInput.value = "";
							this.pwConfirm.value = "";

							this.setState({
								email: "",
								name: "",
								password: "",
								confirm: ""
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
