import React, { useEffect, useRef } from "react";

import Photo from "./Photo";
import { IconButton } from "./Button";
import { photos } from "../content/photos";

// Photos in full screen, on a native modal <dialog>: arrows (buttons or keyboard) go through
// `ids`, Esc or the close button leave. `index` is the photo shown, null when closed.
const PhotoViewer = ({ ids, index, onChange, onClose, label }) => {
    const dialog = useRef(null);
    const opener = useRef(null);
    const open = index !== null;

    useEffect(() => {
        const element = dialog.current;
        if (open && !element.open) {
            opener.current = document.activeElement;
            element.showModal();
        } else if (!open && element.open) element.close();
    }, [open]);

    const move = (step) => onChange((index + step + ids.length) % ids.length);

    const handleKeyDown = (event) => {
        if (ids.length < 2) return;
        if (event.key === "ArrowRight") move(1);
        else if (event.key === "ArrowLeft") move(-1);
    };

    const handleClose = () => {
        if (opener.current && opener.current.isConnected) opener.current.focus();
        if (open) onClose();
    };

    return (
        <dialog
            ref={dialog}
            className="photo-viewer"
            aria-label={label}
            onClose={handleClose}
            onKeyDown={handleKeyDown}
        >
            {open && (
                <>
                    <figure className="photo-viewer__figure">
                        <Photo id={ids[index]} sizes="100vw" priority />
                        <figcaption className="photo-viewer__caption body-medium">
                            {photos[ids[index]].alt}
                            {ids.length > 1 && (
                                <span className="photo-viewer__count">
                                    {" "}
                                    · {index + 1} / {ids.length}
                                </span>
                            )}
                        </figcaption>
                    </figure>
                    <IconButton
                        icon="close"
                        label="Fermer"
                        variant="tonal"
                        className="photo-viewer__close"
                        onClick={() => dialog.current.close()}
                    />
                    {ids.length > 1 && (
                        <>
                            <IconButton
                                icon="chevronLeft"
                                label="Photo précédente"
                                variant="tonal"
                                className="photo-viewer__previous"
                                onClick={() => move(-1)}
                            />
                            <IconButton
                                icon="chevronRight"
                                label="Photo suivante"
                                variant="tonal"
                                className="photo-viewer__next"
                                onClick={() => move(1)}
                            />
                        </>
                    )}
                </>
            )}
        </dialog>
    );
};

export default PhotoViewer;
