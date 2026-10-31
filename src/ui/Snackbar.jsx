import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { IconButton } from "./Button";

// One message at a time, shown by the SnackbarHost of the layout: a new message replaces the
// current one, so an old error never hides a newer one
let latest = null;
let listener = null;
let placeListener = null;

// A modal <dialog> makes the rest of the page inert: a message shown behind it would be dimmed,
// out of reach and maybe not announced. So the snackbars are rendered inside the top-most open
// dialog, if any: in its slot at the top of its content (Dialog), where it pushes the fields down
// instead of covering them, or else over it. Dialogs call this when they open and close.
export const placeSnackbars = () => {
    if (placeListener) placeListener();
};

const topDialog = () => {
    const open = document.querySelectorAll("dialog[open]");
    const dialog = open.length ? open[open.length - 1] : null;
    return dialog && (dialog.querySelector("[data-snackbar-slot]") || dialog);
};

// Shows a short message at the bottom of the screen, instead of window.alert().
// Errors stay until dismissed, other messages for 5 seconds.
export const showSnackbar = (message, { error = false } = {}) => {
    latest = { message: String(message), error, id: Date.now() + Math.random() };
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
            setCurrent(latest);
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

    const dismiss = () => {
        latest = null;
        setCurrent(null);
    };

    // In a dialog's slot, the message is at the top of a content that may be scrolled
    useEffect(() => {
        if (current && dialog && dialog.hasAttribute("data-snackbar-slot"))
            dialog.scrollIntoView({ block: "nearest" });
    }, [current, dialog]);

    const snackbars = (
        <div
            className={
                "md-snackbar-host" +
                (dialog && dialog.hasAttribute("data-snackbar-slot")
                    ? " md-snackbar-host--inline"
                    : "")
            }
        >
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
