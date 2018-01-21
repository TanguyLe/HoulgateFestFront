import React from "react";
import { storiesOf } from "@storybook/react";

import Card from "../";

storiesOf("Card", module).add("Basic Card", () => (
  <Card>
    <Card.title>Title</Card.title>
    <Card.content>Content</Card.content>
    <Card.footer>Footer</Card.footer>
  </Card>
));
