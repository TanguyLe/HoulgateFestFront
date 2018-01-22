/* @flow */
import React, { Component } from "react";
import glamorous from "glamorous";
import { cardShadow } from "../../style/shadows";

const CardStyle = glamorous.div({
  display: "flex",
  flexDirection: "column",
  background: "white",
  borderRadius: "5px",
  boxShadow: cardShadow,
  minWidth: 250,
  maxWidth: 350,
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 300,
  margin: "auto"
});
const TitleStyle = glamorous.div({
  marginTop: 0,
  marginBottom: 0,
  height: 48,
  padding: 0,
  paddingLeft: "1em",
  display: "flex",
  alignItems: "center",

  width: "100%",
  fontSize: "1.5em"
});
const ContentStyle = glamorous.div({
  borderTop: "1px solid rgba(0, 0, 0, 0.15)",
  margin: 0,
  padding: "1em 1em"
});
const FooterStyle = glamorous.div({
  borderTop: "1px solid rgba(0, 0, 0, 0.15)",
  padding: "0.75em 1em",
  display: "flex",
  flexFlow: "row",
  justifyContent: "center",
  top: 0,
  left: 0
});

class Card extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <CardStyle style={{ ...this.props.style }}>
        {this.props.children}
      </CardStyle>
    );
  }
}

class Title extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TitleStyle style={{ ...this.props.style }}>
        {this.props.children}
      </TitleStyle>
    );
  }
}

class Content extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ContentStyle style={{ ...this.props.style }}>
        {this.props.children}
      </ContentStyle>
    );
  }
}

class Footer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <FooterStyle style={{ ...this.props.style }}>
        {this.props.children}
      </FooterStyle>
    );
  }
}

Card.title = Title;
Card.content = Content;
Card.footer = Footer;

export default Card;
