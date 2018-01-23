/* @flow */
import React from "react";
import Text from "../Text/index";
import Block from "../Block/index";

class TextBlock extends React.Component {
		render() {
		return (
			<Block {...this.props}>
				<Text {...this.props}>{this.props.children}</Text>
			</Block>
		);
	}
}

export default TextBlock;
