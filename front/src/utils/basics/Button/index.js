/* @flow */
import React from "react";
import glamorous from "glamorous";

import { focusShadow, INSET_SHADOW } from "../../style/shadows";
import {
	LIGHT_TEXT,
	NORMAL_TEXT,
	DARK_TEXT
} from "../../style/colors/classics";

const ButtonStyle = glamorous.button(
	{
		cursor: "pointer",
		justifyContent: "center",
		alignItems: "center",
		height: "3em",
		minWidth: "3em",
		borderRadius: ".28571429rem",
		overflow: "hidden",
		textOverflow: "ellipsis",
		backgroundColor: "#e0e1e2",
		borderWidth: "0",
		margin: "0.5em",
		fontWeight: "700",
		color: NORMAL_TEXT,
		":focus": {
			outline: "none",
			boxShadow: focusShadow
		},
		":hover": {
			boxShadow: "none",
			backgroundColor: "#cacbcd",
			color: DARK_TEXT
		},
		":active": {
			outline: "none",
			boxShadow: INSET_SHADOW,
			transform: "translate(opx,1px)"
		}
	},
	props => {
		return {
			borderColor: props.color ? props.color : "black",
			color: props.color ? props.color : NORMAL_TEXT
		};
	},
	props => {
		if (props.blockButton === true) {
			return {
				margin: 0,
				backgroundColor: "transparent",
				boxSizing: "unset",
				borderRadius: 0,
				borderRightWidth: "1px",
				borderLeftWidth: "1px",
				borderTopWidth: "0px",
				borderBottomWidth: "0px",
				borderColor: "transparent",
				":hover": {
					borderColor: props.color ? props.color : "white",
					backgroundColor: "transparent"
				},
				":active": {
					borderColor: props.color ? props.color : "white",
					borderStyle: "inset"
				}
			};
		}
	}
);

class Button extends React.Component {
		render() {
		return <ButtonStyle {...this.props}>{this.props.children}</ButtonStyle>;
	}
}

export default Button;
