import React, { useEffect, useState } from "react";

import { IconButton } from "./Button";

// Messages are queued and shown one at a time by the SnackbarHost of the layout
let queue = [];
let listener = null;

// Shows a short message at the bottom of the screen, instead of window.alert().
// `error` messages stay longer.
export const showSnackbar = (message, { error = false } = {}) => {
    queue.push({ message: String(message), error, id: Date.now() + Math.random() });
    if (listener) listener();
};

export const showError = (message) => showSnackbar(message, { error: true });

export const SnackbarHost = () => {
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        listener = () => setCurrent((shown) => shown || queue.shift() || null);
        listener();

        return () => {
            listener = null;
        };
    }, []);

    useEffect(() => {
        if (!current) return;

        const timeout = setTimeout(() => dismiss(), current.error ? 10000 : 5000);
        return () => clearTimeout(timeout);
    }, [current]);

    const dismiss = () => setCurrent(queue.shift() || null);

    // The live region stays in the page so screen readers announce what is put in it
    return (
        <div className="md-snackbar-host" role="status" aria-live="polite">
            {current && (
                <div
                    key={current.id}
                    className={"md-snackbar" + (current.error ? " md-snackbar--error" : "")}
                >
                    <p className="md-snackbar__text body-medium">{current.message}</p>
                    <IconButton icon="close" label="Fermer le message" onClick={dismiss} />
                </div>
            )}
        </div>
    );
};
