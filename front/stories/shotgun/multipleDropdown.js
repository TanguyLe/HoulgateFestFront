import React from "react";
import { storiesOf } from "@storybook/react";

import MultipleDropdown from "../../src/shotgun/Room/multipleDropdown";

storiesOf("MultipleDropdown", module).add("MultipleDropdown 3 persons", () => (
	<MultipleDropdown
		numberOfBeds={3}
		availablePersonIds={["Tanguy", "Gautier", "Nicolas", "Hugo"]}
	/>
));
