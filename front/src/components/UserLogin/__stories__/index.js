import React from "react";
import { storiesOf } from "@storybook/react";

import UserLogin from "../";

storiesOf("UserLogin", module).add("Basic UserLogin", () => (
  <UserLogin name={"test"} email={"test@gmail.com"} />
));
