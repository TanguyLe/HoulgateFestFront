import React from "react";

// The site's one signature shape: the 9-sided "cookie" of the M3 Expressive shape library, a circle
// with soft scallops, drawn in a 100 x 100 box
const cookiePath = (() => {
    const lobes = 9;
    const points = 180;
    const path = [];
    for (let index = 0; index < points; index++) {
        const angle = (index / points) * 2 * Math.PI - Math.PI / 2;
        const radius = 46 + 4 * Math.cos(lobes * angle);
        const x = (50 + radius * Math.cos(angle)).toFixed(2);
        const y = (50 + radius * Math.sin(angle)).toFixed(2);
        path.push((index ? "L" : "M") + x + " " + y);
    }
    return path.join("") + "Z";
})();

// An edition's badge: its year in the cookie shape, in the colours of the edition (`.edition-<year>`
// on a parent) or of the site
const EditionBadge = ({ year, size = "medium", label, className = "" }) => (
    <span
        className={"edition-badge edition-badge--" + size + " " + className}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : "true"}
    >
        <svg viewBox="0 0 100 100" className="edition-badge__shape" focusable="false">
            <path d={cookiePath} />
        </svg>
        <span className="edition-badge__year">{year}</span>
    </span>
);

export default EditionBadge;
