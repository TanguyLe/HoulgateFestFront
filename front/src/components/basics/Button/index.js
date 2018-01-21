/* @flow */
import React, { Component } from "react";
import glamorous from "glamorous";

import { focusShadow, insetShadow } from "../../../style/shadows";
import {
  lightText,
  normalText,
  darkText
} from "../../../style/colors/classics";

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
    color: normalText,
    ":focus": {
      outline: "none",
      boxShadow: focusShadow
    },
    ":hover": {
      boxShadow: "none",
      backgroundColor: "#cacbcd",
      color: darkText
    },
    ":active": {
      outline: "none",
      boxShadow: insetShadow,
      transform: "translate(opx,1px)"
    }
  },
  props => {
    return {
      borderColor: props.color ? props.color : "black",
      color: props.color ? props.color : normalText
    };
  },
  props => {
    if (props.blockButton == true) {
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

class Button extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <ButtonStyle {...this.props}>{this.props.children}</ButtonStyle>;
  }
}

export default Button;
