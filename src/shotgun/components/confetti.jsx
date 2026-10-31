import React, { useMemo } from "react";

const COLORS = ["var(--accent)", "var(--sea-500)", "var(--sun-400)", "var(--coral-500)", "#fff"];

// A burst of CSS confetti (hidden when the user prefers reduced motion)
const Confetti = ({ pieces = 48 }) => {
    const bits = useMemo(
        () =>
            Array.from({ length: pieces }, (_, index) => ({
                left: Math.round(Math.random() * 100),
                delay: Math.round(Math.random() * 600),
                duration: 1400 + Math.round(Math.random() * 1400),
                drift: Math.round(Math.random() * 120 - 60),
                spin: Math.round(Math.random() * 720 - 360),
                color: COLORS[index % COLORS.length],
                round: index % 3 === 0,
            })),
        [pieces],
    );

    return (
        <div className="confetti" aria-hidden="true">
            {bits.map((bit, index) => (
                <span
                    key={index}
                    className={"confetti__bit" + (bit.round ? " confetti__bit--round" : "")}
                    style={{
                        left: bit.left + "%",
                        background: bit.color,
                        animationDelay: bit.delay + "ms",
                        animationDuration: bit.duration + "ms",
                        "--drift": bit.drift + "px",
                        "--spin": bit.spin + "deg",
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
