/* @flow */
import React from "react";
import glamorous from "glamorous";
import { isNil } from "lodash/fp";
import {
	lightText,
	normalText,
	darkText
} from "../../../../style/colors/classics";

const TextStyle = glamorous.span({}, props => {
	let fontSize = isNil(props.size) ? "1em" : props.size;
	switch (props.size) {
		case "Big":
		case "big":
			fontSize = "1.5em";
			break;
		case "Small":
		case "small":
			fontSize = "0.8em";
			break;
	}

	let color = isNil(props.color) ? normalText : props.color;
	switch (props.color) {
		case "light":
		case "Light":
			color = lightText;
			break;
		case "Dark":
		case "Dark":
			color = darkText;
			break;
	}

	let fontWeight = isNil(props.weight) ? "normal" : props.weight;
	switch (props.weight) {
		case "Bold":
		case "bold":
			if (isNil(props.color)) {
				color = darkText;
			}
			fontWeight = 700;
			break;
		case "Light":
		case "light":
		case "Lighter":
		case "lighter":
			fontWeight = 200;
			break;
		case "Normal":
		case "normal":
			fontWeight = 400;
			break;
	}

	return {
		fontSize: fontSize,
		fontWeight: fontWeight,
		color: color
	};
});

class Text extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return <TextStyle {...this.props}>{this.props.children}</TextStyle>;
	}
}

export default Text;
