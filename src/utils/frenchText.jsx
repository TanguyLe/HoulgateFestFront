import React from "react";

// French ordinals take a superscript: "1er juin" is set as 1<sup>er</sup> juin
const ORDINAL = /(\d+)(er|re|e)\b/g;

export const withOrdinals = (text) =>
    String(text)
        .split(ORDINAL)
        .reduce((nodes, part, index, parts) => {
            // split() with groups gives [text, number, suffix, text, number, suffix, ...]
            if (index % 3 === 0) nodes.push(part);
            else if (index % 3 === 1)
                nodes.push(
                    <React.Fragment key={index}>
                        {part}
                        <sup>{parts[index + 1]}</sup>
                    </React.Fragment>,
                );
            return nodes;
        }, []);
