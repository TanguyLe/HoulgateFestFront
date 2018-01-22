import React from "react";
import { storiesOf } from "@storybook/react";

import Button from "../";

storiesOf("Basics/Button", module).add("Classic", () => (
	<div style={{ display: "flex" }}>
		<Button color={"red"}>Red</Button>
		<Button>test</Button>
		<Button>Classic</Button>
	</div>
));
