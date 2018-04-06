import React from "react";
import { storiesOf } from "@storybook/react";

import UserLogin from "../../../src/login/components";

storiesOf("UserLogin", module)
	.add("not logged UserLogin", () => <UserLogin />)
	.add("logged test UserLogin", () => (
		<UserLogin name={"test"} email={"test@gmail.com"} />
	));
