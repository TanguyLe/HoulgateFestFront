// Self-hosted fonts (the CSP only allows 'self'): Anton for the display type, Space Grotesk for the text
import "@fontsource/anton/latin-400.css";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/ui.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/history.css";
import "./styles/shotgun.css";
import "./styles/pages.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

createRoot(document.getElementById("app")).render(<App />);
