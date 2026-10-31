import React, { useEffect, useRef, useState } from "react";

// Flat geometric shapes in the four stage colours, placed by each page's CSS around its headlines
// (`.shape--<n>` in a composition). Decorative: hidden from screen readers.
const DRAWINGS = {
    circle: { viewBox: "0 0 100 100", body: <circle cx="50" cy="50" r="50" /> },
    // Half a disc, flat side down
    half: { viewBox: "0 0 100 50", body: <path d="M0 50a50 50 0 0 1 100 0Z" /> },
    triangle: {
        viewBox: "0 0 100 90",
        body: (
            <path d="M44.8 4.5a6 6 0 0 1 10.4 0l43.6 76.5a6 6 0 0 1-5.2 9H6.4a6 6 0 0 1-5.2-9Z" />
        ),
    },
    square: { viewBox: "0 0 100 100", body: <rect width="100" height="100" rx="14" /> },
    pill: { viewBox: "0 0 100 40", body: <rect width="100" height="40" rx="20" /> },
    // A quarter of a thick ring
    arc: {
        viewBox: "0 0 100 100",
        body: <path d="M0 100A100 100 0 0 1 100 0v28A72 72 0 0 0 28 100Z" />,
    },
};

export const Shape = ({ kind, color, className = "" }) => {
    const drawing = DRAWINGS[kind];

    return (
        <svg
            className={`shape shape--${kind} shape--${color} ${className}`}
            viewBox={drawing.viewBox}
            aria-hidden="true"
            focusable="false"
        >
            {drawing.body}
        </svg>
    );
};

// A set of shapes for a composition: `shapes` are [kind, color] pairs, numbered in order
// (`.shape--1`, `.shape--2`…) for the page's CSS to place them
export const Shapes = ({ shapes, className = "" }) => (
    <div className={"shapes " + className} aria-hidden="true">
        {shapes.map(([kind, color], index) => (
            <Shape key={index} kind={kind} color={color} className={"shape--" + (index + 1)} />
        ))}
    </div>
);

// A section that fades and slides in the first time it enters the screen, like the next slide of
// a keynote. Without IntersectionObserver, or with reduced motion (CSS), it is simply there.
export const Reveal = ({ as: Element = "section", className = "", children, ...props }) => {
    const element = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "0px 0px -10% 0px" },
        );
        observer.observe(element.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Element
            ref={element}
            className={"reveal " + (visible ? "is-visible " : "") + className}
            {...props}
        >
            {children}
        </Element>
    );
};
