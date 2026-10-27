import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/ui.css";
import "./styles/layout.css";
import "./styles/pages.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

createRoot(document.getElementById("app")).render(<App />);
