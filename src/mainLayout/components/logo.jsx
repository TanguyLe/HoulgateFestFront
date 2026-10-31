import React from "react";

// The wordmark: the sun setting on the sea at Houlgate, in two of the stage's colours, then the
// name. The link around it gives its accessible name.
const Logo = () => (
    <span className="logo">
        <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path className="logo__sun" d="M5 18a11 11 0 0 1 22 0Z" />
            <rect className="logo__sea" x="2" y="21" width="28" height="7" rx="3.5" />
        </svg>
        <span className="logo__name title-large">HoulgateFest</span>
    </span>
);

export default Logo;
