import React from "react";

// "19% 20% 18% 43%" => [0, 19, 39, 57, 100]: where each grid line is, in percent
const gridLines = (template) =>
    template
        .trim()
        .split(/\s+/)
        .reduce((lines, size) => [...lines, lines[lines.length - 1] + parseFloat(size)], [0]);

const GAP = 0.6;

// A schematic plan of a floor, drawn from its grid in villaLesGenetsDef.js: the rooms with beds
// carry their number and the colour of their state, the others are drawn neutral. It repeats the
// list next to it, so it is hidden from screen readers; a click on a room shows it in the list.
const FloorPlan = ({ floor, numbers, states, onSelect }) => {
    const width = floor.size.width * 10;
    const height = floor.size.height * 10;
    const rows = gridLines(floor.gridTemplate.rows).map((line) => (line * height) / 100);
    const columns = gridLines(floor.gridTemplate.columns).map((line) => (line * width) / 100);

    return (
        <svg
            className="floor-plan"
            viewBox={`${-GAP} ${-GAP} ${width + 2 * GAP} ${height + 2 * GAP}`}
            aria-hidden="true"
            focusable="false"
        >
            {floor.rooms.map((room) => {
                const { rows: r, columns: c } = room.gridPosition;
                const x = columns[c.start - 1] + GAP;
                const y = rows[r.start - 1] + GAP;
                const w = columns[c.end - 1] - columns[c.start - 1] - 2 * GAP;
                const h = rows[r.end - 1] - rows[r.start - 1] - 2 * GAP;
                const number = numbers[room._id];
                const size = Math.min(w, h, 26) * 0.55;

                return (
                    <g
                        key={room.name}
                        className={
                            "floor-plan__room" +
                            (number
                                ? " floor-plan__room--bedroom room-state--" + states[room._id]
                                : "")
                        }
                        onClick={number ? () => onSelect(room._id) : undefined}
                    >
                        <rect x={x} y={y} width={w} height={h} rx="2" />
                        {number && (
                            <text
                                x={x + w / 2}
                                y={y + h / 2}
                                fontSize={size}
                                textAnchor="middle"
                                dominantBaseline="central"
                            >
                                {number}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
};

export default FloorPlan;
