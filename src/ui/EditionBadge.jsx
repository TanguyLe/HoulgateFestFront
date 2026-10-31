import React from "react";

// An edition's badge: its year on a disc in the edition's colour (`--accent` on a parent)
const EditionBadge = ({ year, size = "medium", label, className = "" }) => (
    <span
        className={"edition-badge edition-badge--" + size + " " + className}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : "true"}
    >
        <span className="edition-badge__year">{year}</span>
    </span>
);

export default EditionBadge;
