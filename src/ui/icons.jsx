import React from "react";

// A handful of square, thick-stroked icons drawn for the site (24x24 grid)
const PATHS = {
    home: "M3 11 12 3l9 8M5 10v11h5v-6h4v6h5V10",
    bed: "M2 19V6m0 9h20v4m0-4v-3a3 3 0 0 0-3-3h-8v6M6.5 12.5a1.5 1.5 0 1 0 0-.01",
    car: "M3 17v-5l2.5-5h13L21 12v5H3Zm0 0v3h3v-3m12 0v3h3v-3M3 12h18M7 14.5h.01M17 14.5h.01",
    trophy: "M8 4h8v6a4 4 0 0 1-8 0V4Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 2v4m-4 3h8l-1-3H9l-1 3Z",
    more: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    star: "m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8L12 2Z",
    check: "M4 4h16v16H4zM8 12l3 3 5-6",
    mail: "M3 5h18v14H3zM3 5l9 8 9-8",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0",
    gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2.2-1.3L14.4 3h-4l-.4 2.5a7.5 7.5 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1c.7.6 1.4 1 2.2 1.3l.4 2.5h4l.4-2.5c.8-.3 1.5-.7 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3Z",
    arrow: "M4 12h16m-6-6 6 6-6 6",
    close: "M5 5l14 14M19 5 5 19",
    logout: "M15 4h5v16h-5M10 8l-4 4 4 4M6 12h10",
};

const Icon = ({ name, size = 24, className }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
        focusable="false"
    >
        <path d={PATHS[name]} />
    </svg>
);

export default Icon;
