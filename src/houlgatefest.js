// Material 3 tokens: the generated colour scheme first, the other tokens, then the defaults
require("./styles/scheme.css");
require("./styles/tokens.css");
require("./styles/base.css");
require("./styles/components.css");

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

createRoot(document.getElementById("app")).render(<App />);
