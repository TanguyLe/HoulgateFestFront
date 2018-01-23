/* @flow */
import React from "react";
import glamorous from "glamorous";
import Text from "../Text";
import Block from "../Block";

class TextBlock extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Block {...this.props}>
				<Text {...this.props}>{this.props.children}</Text>
			</Block>
		);
	}
}

export default TextBlock;
