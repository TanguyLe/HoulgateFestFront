import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { IconButton } from "./Button";

// Messages are queued and shown one at a time by the SnackbarHost of the layout
let queue = [];
let listener = null;
let placeListener = null;

// A modal <dialog> makes the rest of the page inert: a message shown behind it would be dimmed,
// out of reach and maybe not announced. So the snackbars are rendered inside the top-most open
// dialog, if any. Dialogs call this when they open and close.
export const placeSnackbars = () => {
    if (placeListener) placeListener();
};

const topDialog = () => {
    const open = document.querySelectorAll("dialog[open]");
    return open.length ? open[open.length - 1] : null;
};

// Shows a short message at the bottom of the screen, instead of window.alert().
// Errors stay until dismissed, other messages for 5 seconds.
export const showSnackbar = (message, { error = false } = {}) => {
    queue.push({ message: String(message), error, id: Date.now() + Math.random() });
    if (listener) listener();
};

export const showError = (message) => showSnackbar(message, { error: true });

export const SnackbarHost = () => {
    const [current, setCurrent] = useState(null);
    const [dialog, setDialog] = useState(null);

    useEffect(() => {
        placeListener = () => setDialog(topDialog());
        listener = () => {
            setDialog(topDialog());
            setCurrent((shown) => shown || queue.shift() || null);
        };
        listener();

        return () => {
            listener = null;
            placeListener = null;
        };
    }, []);

    useEffect(() => {
        if (!current || current.error) return;

        const timeout = setTimeout(() => dismiss(), 5000);
        return () => clearTimeout(timeout);
    }, [current]);

    const dismiss = () => setCurrent(queue.shift() || null);

    const snackbars = (
        <div className="md-snackbar-host">
            {/* Both live regions stay in place so screen readers announce what is put in them */}
            <div role="alert">
                {current && current.error && (
                    <Snackbar
                        key={current.id}
                        message={current.message}
                        error
                        onDismiss={dismiss}
                    />
                )}
            </div>
            <div role="status">
                {current && !current.error && (
                    <Snackbar key={current.id} message={current.message} onDismiss={dismiss} />
                )}
            </div>
        </div>
    );

    return dialog && dialog.isConnected ? createPortal(snackbars, dialog) : snackbars;
};

const Snackbar = ({ message, error, onDismiss }) => (
    <div className={"md-snackbar" + (error ? " md-snackbar--error" : "")}>
        <p className="md-snackbar__text body-medium">{message}</p>
        <IconButton icon="close" label="Fermer le message" onClick={onDismiss} />
    </div>
);
