import React from "react";
import { storiesOf } from "@storybook/react";

import TextBlock from "../";

storiesOf("Basics/TextBlock", module)
  .add("size and align", () => (
    <div style={{ display: "flex" }}>
      <TextBlock align={"left"} size={"small"}>
        Small Left
      </TextBlock>
      <TextBlock>Default</TextBlock>
      <TextBlock align={"right"} size={"Big"}>
        Big Right
      </TextBlock>
    </div>
  ))
  .add("padding", () => (
    <div>
      <TextBlock noPadding>no Padding</TextBlock>
      <TextBlock padding={"small"}>small</TextBlock>
      <TextBlock padding={"normal"}>normal</TextBlock>
      <TextBlock>Default</TextBlock>
      <TextBlock padding={"Big"}>Big</TextBlock>
      <TextBlock padding={"10em"}>10em padding</TextBlock>
    </div>
  ));
