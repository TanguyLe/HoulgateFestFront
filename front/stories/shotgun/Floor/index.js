import React from "react";
import { storiesOf } from "@storybook/react";

import GroundFloor from "../../../src/shotgun/Floors/GroundFloor";
import FirstFloor from "../../../src/shotgun/Floors/FirstFloor";
import SecondFloor from "../../../src/shotgun/Floors/SecondFloor";

storiesOf("Floor", module)
	.add("Ground Floor ", () => <GroundFloor />)
	.add("First Floor ", () => <FirstFloor />)
	.add("Second Floor ", () => <SecondFloor />);
