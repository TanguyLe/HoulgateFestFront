import React, { useRef } from "react";

import { Icon } from "../../ui";

// A swipeable strip of photos (CSS scroll snapping), with arrows for mouse users
export const ImagesCarousel = ({ images, label }) => {
    const strip = useRef(null);

    const scroll = (direction) => {
        const element = strip.current;
        if (!element) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        element.scrollBy({
            left: direction * element.clientWidth * 0.85,
            behavior: reduce ? "auto" : "smooth",
        });
    };

    if (!images.length) return null;

    return (
        <div className="gallery" role="region" aria-label={label}>
            <div className="gallery__strip" ref={strip} tabIndex={0}>
                {images.map((image, index) => (
                    <figure key={image.path} className="gallery__item">
                        <img
                            src={image.path}
                            alt={label + ", photo " + (index + 1)}
                            loading="lazy"
                        />
                    </figure>
                ))}
            </div>
            {images.length > 1 && (
                <div className="gallery__nav">
                    <button type="button" className="gallery__btn" onClick={() => scroll(-1)}>
                        <Icon name="chevronLeft" title="Photo précédente" />
                    </button>
                    <button type="button" className="gallery__btn" onClick={() => scroll(1)}>
                        <Icon name="chevronRight" title="Photo suivante" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImagesCarousel;
