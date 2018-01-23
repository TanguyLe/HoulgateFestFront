/* @flow */
import React from "react";
import glamorous from "glamorous";
import { isNil } from "lodash/fp";

const BlockStyle = glamorous.div(props => {
	const padding = isNil(props.padding)
		? "1em"
		: props.padding === "small" || props.padding === "Small"
			? "0.5em"
			: props.padding === "normal" || props.padding === "Normal"
				? "1em"
				: props.padding === "big" || props.padding === "Big"
					? "2em"
					: props.padding;

	return {
		marginTop: "auto",
		marginBottom: "auto",
		padding: props.noPadding ? "0" : padding,
		marginLeft: isNil(props.align)
			? "auto"
			: props.align.toLowerCase() == "left" ? 0 : "auto",
		marginRight: isNil(props.align)
			? "auto"
			: props.align.toLowerCase() == "right" ? 0 : "auto"
	};
});

class Block extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return <BlockStyle {...this.props}>{this.props.children}</BlockStyle>;
	}
}

export default Block;
