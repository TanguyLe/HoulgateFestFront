import React from "react";
import { storiesOf } from "@storybook/react";

import Block from "../../src/utils/basics/Block/index";
import Text from "../../src/utils/basics/Text/index";

storiesOf("Basics/Block", module).add("Align", () => (
	<div style={{ display: "flex" }}>
		<Block align={"left"}>
			<Text> left </Text>
		</Block>
		<Block>
			<Text> center </Text>
		</Block>
		<Block align={"Right"}>
			<Text> Right </Text>
		</Block>
	</div>
));
