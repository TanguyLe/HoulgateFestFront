import React from "react";
import { storiesOf } from "@storybook/react";

import TextBlock from "../../TextBlock";
import Wrapper from "../";

storiesOf("Basics/Wrapper", module)
	.add("row", () => (
		<Wrapper row>
			<TextBlock>Hello </TextBlock>
			<TextBlock>From the other side </TextBlock>
		</Wrapper>
	))
	.add("column", () => (
		<Wrapper column>
			<TextBlock>Hello </TextBlock>
			<TextBlock>From the other side </TextBlock>
		</Wrapper>
	))
	.add("no flex", () => (
		<Wrapper noFlex>
			<TextBlock>Hello </TextBlock>
			<TextBlock>From the other side </TextBlock>
		</Wrapper>
	));
