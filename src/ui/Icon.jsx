import React from "react";

import { icons } from "./icons";

// A Material Symbols Rounded icon. Decorative: the text next to it, or the aria-label of its
// button, says what it means.
const Icon = ({ name, filled = false, className = "" }) => (
    <svg
        className={"md-icon " + className}
        viewBox="0 -960 960 960"
        aria-hidden="true"
        focusable="false"
    >
        <path d={(filled && icons[name + "Filled"]) || icons[name]} />
    </svg>
);

export default Icon;
