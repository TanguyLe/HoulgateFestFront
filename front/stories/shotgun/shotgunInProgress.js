import React from "react";
import { storiesOf } from "@storybook/react";

import ShotgunInProgress from "../../src/shotgun/Room/shotgunInProgress";

storiesOf("ShotgunInProgress", module).add(
	"ShotgunInProgress 3 persons",
	() => (
		<ShotgunInProgress
			numberOfBeds={3}
			availablePersonIds={["Tanguy", "Gautier", "Nicolas", "Hugo"]}
		/>
	)
);
