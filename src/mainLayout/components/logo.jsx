import React from "react";

import { cookiePath } from "../../ui/EditionBadge";

// The wordmark: an H in the signature cookie shape (drawn, not text), then the name
const Logo = () => (
    <span className="logo">
        <svg className="logo__mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <path d={cookiePath} />
            <path className="logo__letter" d="M33 28h10v17h14V28h10v44H57V54H43v18H33z" />
        </svg>
        <span className="logo__name title-large emphasized">HoulgateFest</span>
    </span>
);

export default Logo;
