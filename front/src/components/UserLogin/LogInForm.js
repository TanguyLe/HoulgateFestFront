/* @flow */
import React from "react";
import Button from "../basics/Button";
import Block from "../basics/Block";
import TextBlock from "../basics/TextBlock";
import Wrapper from "../basics/Wrapper";

class logIn extends React.Component {
	constructor(props) {
		super(props);
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
						Password:
					</TextBlock>
					<input
						type={"password"}
						onChange={() =>
							this.setState({
								email: this.mailInput.value,
								password: this.pwInput.value
							})
						}
						ref={node => {
							this.pwInput = node;
						}}
					/>
				</Block>
				<Block>
					<Button
						onClick={() => {
							alert([
								"email: ",
								this.state.email,
								" password: ",
								this.state.password
							]);
							this.props.onClick;
						}}
					>
						Send
					</Button>
					<Button
						onClick={() => {
							this.mailInput.value = "";
							this.pwInput.value = "";
						}}
					>
						Reset
					</Button>
				</Block>
			</Wrapper>
		);
	}
}

//export default getRouteProps(logIn);
export default logIn;
