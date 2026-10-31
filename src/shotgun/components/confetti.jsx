import React from "react";

const COLORS = ["var(--accent)", "#0a0a0a", "#00d26a", "#ffc400", "#ff2d6f", "#3d8bff"];
const PIECES = 64;

// Pure CSS confetti burst, hidden when the user prefers reduced motion (see shotgun.css)
const pieces = Array.from({ length: PIECES }, (_, index) => ({
    "--x": ((index * 37) % 100) + "vw",
    "--drift": ((index * 53) % 30) - 15 + "vw",
    "--delay": ((index * 71) % 900) + "ms",
    "--dur": 1800 + ((index * 97) % 1400) + "ms",
    "--rot": ((index * 139) % 720) - 360 + "deg",
    "--c": COLORS[index % COLORS.length],
    "--w": 6 + (index % 4) * 3 + "px",
    "--h": 10 + (index % 3) * 6 + "px",
}));

const Confetti = () => (
    <div className="confetti" aria-hidden="true">
        {pieces.map((style, index) => (
            <span key={index} className="confetti__piece" style={style} />
        ))}
    </div>
);

export default Confetti;
