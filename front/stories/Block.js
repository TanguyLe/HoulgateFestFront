import React from "react";
import { storiesOf } from "@storybook/react";

import Block from "../src/components/basics/Block";
import Text from "../src/components/basics/Text";

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
