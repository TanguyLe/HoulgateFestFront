import React from "react";

// M3 indeterminate circular progress indicator
export const CircularProgress = ({ size = "medium", label }) => (
    <svg
        className={"md-circular-progress md-circular-progress--" + size}
        viewBox="0 0 48 48"
        role={label ? "progressbar" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : "true"}
    >
        <circle cx="24" cy="24" r="20" />
    </svg>
);

// M3 indeterminate linear progress indicator
export const LinearProgress = ({ label }) => (
    <div className="md-linear-progress" role="progressbar" aria-label={label}>
        <div className="md-linear-progress__bar" />
    </div>
);

// What a page shows while it loads: a spinner and what is happening
export const Loading = ({ children }) => (
    <div className="md-loading" role="status">
        <CircularProgress />
        <p className="body-large on-surface-variant">{children}</p>
    </div>
);
