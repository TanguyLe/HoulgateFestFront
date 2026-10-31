import React, { useEffect, useId, useRef } from "react";

import Icon from "./Icon";
import { Button, IconButton } from "./Button";

// M3 basic dialog, on a native modal <dialog>: the page behind is inert, Esc closes it and the
// focus goes back where it was. With `sheet`, it is a bottom sheet on compact screens.
// `onClose` is called whenever the user dismisses it (Esc, scrim, close button).
const Dialog = ({
    open,
    onClose,
    title,
    icon,
    sheet = false,
    actions,
    dismissible = true,
    className = "",
    children,
}) => {
    const dialog = useRef(null);
    const opener = useRef(null);
    const pressedOnScrim = useRef(false);
    const titleId = useId();

    useEffect(() => {
        const element = dialog.current;
        if (!element) return;

        if (open && !element.open) {
            opener.current = document.activeElement;
            element.showModal();
            // The field to fill first, rather than the close button
            const first = element.querySelector("[data-autofocus]");
            if (first) first.focus();
        } else if (!open && element.open) element.close();
    }, [open]);

    // Gives the focus back on unmount too, when the dialog goes away with its parent
    useEffect(
        () => () => {
            if (opener.current && opener.current.isConnected) opener.current.focus();
        },
        [],
    );

    const handleClose = () => {
        if (opener.current && opener.current.isConnected) opener.current.focus();
        opener.current = null;
        if (open && onClose) onClose();
    };

    const handleCancel = (event) => {
        if (!dismissible) event.preventDefault();
    };

    // A click on the dialog element itself, not on its container, is a click on the scrim
    const handleMouseDown = (event) => {
        pressedOnScrim.current = event.target === dialog.current;
    };
    const handleClick = (event) => {
        if (dismissible && pressedOnScrim.current && event.target === dialog.current)
            dialog.current.close();
    };

    return (
        <dialog
            ref={dialog}
            className={"md-dialog " + (sheet ? "md-dialog--sheet " : "") + className}
            aria-labelledby={title ? titleId : undefined}
            onClose={handleClose}
            onCancel={handleCancel}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            {open && (
                <div className="md-dialog__container">
                    {sheet && <div className="md-dialog__handle" aria-hidden="true" />}
                    <div className="md-dialog__header">
                        {icon && <Icon name={icon} className="md-dialog__icon" />}
                        {title && (
                            <h2 id={titleId} className="md-dialog__headline headline-small">
                                {title}
                            </h2>
                        )}
                        {dismissible && (
                            <IconButton
                                icon="close"
                                label="Fermer"
                                className="md-dialog__close"
                                onClick={() => dialog.current.close()}
                            />
                        )}
                    </div>
                    <div className="md-dialog__content body-medium">{children}</div>
                    {actions && <div className="md-dialog__actions">{actions}</div>}
                </div>
            )}
        </dialog>
    );
};

export default Dialog;

// A dialog asking to confirm an action: `danger` for what can't be undone
export const ConfirmDialog = ({
    open,
    title,
    confirmLabel = "Confirmer",
    danger = false,
    onConfirm,
    onCancel,
    children,
}) => (
    <Dialog
        open={open}
        onClose={onCancel}
        title={title}
        actions={
            <>
                <Button variant="text" onClick={onCancel}>
                    Annuler
                </Button>
                <Button
                    variant={danger ? "filled" : "text"}
                    className={danger ? "md-button--danger" : ""}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>
            </>
        }
    >
        {children}
    </Dialog>
);
