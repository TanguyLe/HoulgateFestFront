import React from "react";

// A small hand-picked stroke icon set (24x24, currentColor), so no icon font is needed
const PATHS = {
    home: "M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5",
    bed: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 18h18M3 18v2M21 18v2M6 9V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3M8 13h3",
    car: "M5 16h14M5 16v3h3v-3M16 16v3h3v-3M4 16v-4l2-5h12l2 5v4M4 12h16M7.5 14h.01M16.5 14h.01",
    trophy: "M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6v4H9z",
    menu: "M4 7h16M4 12h16M4 17h16",
    more: "M5 12h.01M12 12h.01M19 12h.01",
    history: "M3 12a9 9 0 1 0 3-6.7M3 4v4h4M12 7v5l3 2",
    checklist: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
    mail: "M3 6h18v12H3zM3 7l9 6 9-6",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
    logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
    login: "M15 4h4v16h-4M10 8l4 4-4 4M14 12H4",
    settings:
        "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.5 7.5 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.5 7.5 0 0 0-1.7 1l-2.3-.9-2 3.4 2 1.5a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a7.5 7.5 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.5 7.5 0 0 0 1.7-1l2.3.9 2-3.4Z",
    close: "M6 6l12 12M18 6 6 18",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
    arrow: "M5 12h14M13 6l6 6-6 6",
    external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
    sparkle:
        "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8ZM19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7Z",
    tent: "M12 4 3 20h18L12 4ZM12 4v16M9 20l3-6 3 6",
    sofa: "M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2v-5ZM5 18v2M19 18v2",
    lock: "M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3",
    check: "M5 12.5l4.5 4.5L19 7.5",
    plus: "M12 5v14M5 12h14",
    trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
    save: "M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",
    undo: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
    edit: "M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4",
    archive: "M3 4h18v4H3zM5 8v12h14V8M10 12h4",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01",
    alert: "M12 3 2 20h20L12 3ZM12 10v4M12 17h.01",
    calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
    users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M18 14a7 7 0 0 1 4 7",
    camera: "M4 7h4l2-3h4l2 3h4v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    wave: "M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5-1",
    heart: "M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z",
    chevronLeft: "M15 5l-7 7 7 7",
    chevronRight: "M9 5l7 7-7 7",
};

const Icon = ({ name, size = 20, className = "", title, strokeWidth = 1.8 }) => (
    <svg
        className={"icon " + className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={title ? undefined : true}
        role={title ? "img" : undefined}
        focusable="false"
    >
        {title && <title>{title}</title>}
        <path d={PATHS[name] || PATHS.sparkle} />
    </svg>
);

export default Icon;
