import React from "react";
import { storiesOf } from "@storybook/react";

import Text from "../src/components/basics/Text";

storiesOf("Basics/Text", module)
	.add("Small", () => (
		<div>
			<Text size="small">Hello </Text>
			<br />
			<Text size="Small"> This Text is Small </Text>
		</div>
	))
	.add("Normal", () => (
		<div>
			<Text>Hello </Text>
			<br />
			<Text> This Text is Normal </Text>
		</div>
	))
	.add("Big", () => (
		<div>
			<Text size="big">Hello </Text>
			<br />
			<Text size="Big"> This Text is Big </Text>
		</div>
	))
	.add("All Sizes", () => (
		<div>
			<Text size="Small"> This Text is Small </Text>
			<br />
			<Text> This Text is Normal </Text>
			<br />
			<Text size="Big"> This Text is Big </Text>
		</div>
	))
	.add("font Weight", () => (
		<div>
			<Text weight="light"> This Text is light </Text>
			<br />
			<Text weight="normal"> This Text is Normal </Text>
			<br />
			<Text weight="Bold"> This Text is Bold </Text>
		</div>
	));
