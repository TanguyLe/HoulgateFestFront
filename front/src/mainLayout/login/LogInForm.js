/* @flow */
import React from "react";
import Button from "../../utils/basics/Button/index";
import Block from "../../utils/basics/Block/index";
import TextBlock from "../../utils/basics/TextBlock/index";
import Wrapper from "../../utils/basics/Wrapper/index";

class logIn extends React.Component {
		render() {
		return (
			<Wrapper column style={{ ...this.props.style }}>
				<Block padding={"small"}>
					<TextBlock weight={"bold"} padding={"small"}>
						Email:
					</TextBlock>
					<input
						onChange={() => this.setState({email: this.mailInput.value})}
						ref={node => {this.mailInput = node;}}
					/>
				</Block>
				<Block padding={"small"}>
					<TextBlock weight={"bold"} padding={"small"}>
						Password:
					</TextBlock>
					<input
						type={"password"}
						onChange={() => this.setState({password: this.pwInput.value})}
						ref={node => {this.pwInput = node;}}
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
                            /* Call something from props here*/
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
