import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/ui.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/shotgun.css";
import "./styles/history.css";
import "./styles/pages.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app";
import { restoreSession } from "./login/session";

// Checks the saved session as early as possible, every component then waits for it
restoreSession();

createRoot(document.getElementById("app")).render(<App />);
