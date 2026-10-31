import React from "react";

import { cookiePath } from "../../ui/EditionBadge";

// The wordmark: an H in the signature cookie shape, then the name
const Logo = () => (
    <span className="logo">
        <svg className="logo__mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <path d={cookiePath} />
            <text x="50" y="51" textAnchor="middle" dominantBaseline="central">
                H
            </text>
        </svg>
        <span className="logo__name title-large emphasized">HoulgateFest</span>
    </span>
);

export default Logo;
