import React from "react";
import { storiesOf } from "@storybook/react";

import UserLogin from "../../../src/mainLayout/login/components";

storiesOf("UserLogin", module).add("not logged UserLogin", () => <UserLogin />);
storiesOf("UserLogin", module).add("logged test UserLogin", () => (
	<UserLogin name={"test"} email={"test@gmail.com"} />
));
