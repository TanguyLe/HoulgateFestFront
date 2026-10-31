// The stage's colours first, the other tokens, then the defaults and the components
require("./styles/stage.css");
require("./styles/tokens.css");
require("./styles/base.css");
require("./styles/components.css");

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

createRoot(document.getElementById("app")).render(<App />);
