import React from "react";

import { photos } from "../content/photos";

const srcset = (id, format) =>
    [640, photos[id].width]
        .filter((width, index, widths) => widths.indexOf(width) === index)
        .map((width) => `/static/photos/${id}-${width}.${format} ${width}w`)
        .join(", ");

// One of our photos, in AVIF or WebP at the size the layout needs. `sizes` tells the browser how
// wide it is displayed. Lazy unless `priority` (the photo at the top of a page).
const Photo = ({ id, sizes = "100vw", priority = false, className = "" }) => {
    const photo = photos[id];

    return (
        <picture className={"md-photo " + className}>
            <source type="image/avif" srcSet={srcset(id, "avif")} sizes={sizes} />
            <img
                src={`/static/photos/${id}-640.webp`}
                srcSet={srcset(id, "webp")}
                sizes={sizes}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading={priority ? "eager" : "lazy"}
                decoding={priority ? "sync" : "async"}
                fetchpriority={priority ? "high" : undefined}
            />
        </picture>
    );
};

export default Photo;
