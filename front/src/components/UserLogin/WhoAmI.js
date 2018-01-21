/* @flow */
import React, { Component } from "react";
import glamorous from "glamorous";

import Button from "../basics/Button";
import Block from "../basics/Block";
import Text from "../basics/Text";
import TextBlock from "../basics/TextBlock";
import Wrapper from "../basics/Wrapper";

class WhoAmI extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Wrapper column>
        <Block>
          <Block padding={"small"} align={"left"}>
            <Text weight={"bold"}>Name: </Text>
            <Text>{this.props.name}</Text>
          </Block>
          <Block padding={"small"} align={"left"}>
            <Text weight={"bold"}>Mail: </Text>
            <Text>{this.props.email}</Text>
          </Block>
        </Block>
      </Wrapper>
    );
  }
}

export default WhoAmI;
