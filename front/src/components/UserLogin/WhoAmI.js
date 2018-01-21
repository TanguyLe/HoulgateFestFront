/* @flow */
import React, { Component } from "react";
import glamorous from "glamorous";
import { isNil } from "lodash/fp";

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
    let ContentToDisplay;
    if (isNil(this.props.name) || isNil(this.props.email)) {
      ContentToDisplay = () => (
        <Wrapper column>
          <Block>
            <Block padding={"small"} align={"left"}>
              <Text weight={"bold"}>T Pa Loggé Gros </Text>
            </Block>
            <Block padding={"small"} align={"left"}>
              <Text>Moi j'aime bien les abricots</Text>
            </Block>
          </Block>
        </Wrapper>
      );
    } else {
      ContentToDisplay = () => (
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

    return <ContentToDisplay />;
  }
}

export default WhoAmI;
