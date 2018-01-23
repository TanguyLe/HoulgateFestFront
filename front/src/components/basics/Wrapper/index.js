/* @flow */
import React from "react";
import glamorous from "glamorous";

const WrapperStyle = glamorous.div(props => ({
	display: props.noFlex ? "unset" : "flex",
	flexDirection: props.row ? "row" : props.column ? "column" : "unset"
}));

class Wrapper extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<WrapperStyle {...this.props}>{this.props.children}</WrapperStyle>
		);
	}
}

export default Wrapper;
