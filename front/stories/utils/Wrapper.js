import React from "react";
import { storiesOf } from "@storybook/react";

import TextBlock from "../../src/utils/basics/TextBlock/index";
import Wrapper from "../../src/utils/basics/Wrapper/index";

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
