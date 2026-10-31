import React, { useEffect, useId, useRef } from "react";

import Icon from "./icon";

export { Icon };

export const btnClass = (variant = "secondary", size = "", extra = "") =>
    ["btn", "btn--" + variant, size ? "btn--" + size : "", extra].filter(Boolean).join(" ");

export const Spinner = ({ label, small }) => (
    <span className={"spinner" + (small ? " spinner--sm" : "")} role="status">
        <span className="spinner__dot" aria-hidden="true" />
        {label ? <span className="spinner__label">{label}</span> : null}
    </span>
);

export const Button = ({
    variant = "secondary",
    size,
    icon,
    loading = false,
    className = "",
    children,
    type = "button",
    disabled,
    ...rest
}) => (
    <button
        type={type}
        className={btnClass(variant, size, className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
    >
        {loading ? (
            <span className="spinner__dot" aria-hidden="true" />
        ) : icon ? (
            <Icon name={icon} size={18} />
        ) : null}
        {children ? <span>{children}</span> : null}
    </button>
);

const NOTICE_ICONS = { info: "info", success: "check", error: "alert", warning: "alert" };

export const Notice = ({ kind = "info", title, children, onDismiss, loading, className = "" }) => (
    <div
        className={"notice notice--" + kind + " " + className}
        role={kind === "error" ? "alert" : "status"}
    >
        <span className="notice__icon" aria-hidden="true">
            {loading ? <span className="spinner__dot" /> : <Icon name={NOTICE_ICONS[kind]} />}
        </span>
        <div className="notice__body">
            {title && <strong className="notice__title">{title}</strong>}
            {children}
        </div>
        {onDismiss && (
            <button type="button" className="notice__close" onClick={onDismiss}>
                <Icon name="close" size={16} title="Fermer" />
            </button>
        )}
    </div>
);

export const Loading = ({ children }) => (
    <Notice kind="info" loading>
        {children}
    </Notice>
);

export const ErrorList = ({ messages }) => {
    const shown = messages.filter(Boolean);
    if (!shown.length) return null;

    return (
        <Notice kind="error">
            <ul className="notice__list">
                {shown.map((message) => (
                    <li key={message}>{message}</li>
                ))}
            </ul>
        </Notice>
    );
};

// Native <dialog>: focus trapping, Escape and the top layer come for free.
export const Dialog = ({
    open,
    onClose,
    title,
    children,
    footer,
    variant = "center",
    className = "",
    labelId,
    style,
}) => {
    const ref = useRef(null);
    const autoId = useId();
    const titleId = labelId || autoId;

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) {
            dialog.showModal();
            const target = dialog.querySelector("[data-autofocus]");
            if (target) target.focus();
        }
        if (!open && dialog.open) dialog.close();
    }, [open]);

    useEffect(() => {
        const dialog = ref.current;
        return () => {
            if (dialog && dialog.open) dialog.close();
        };
    }, []);

    return (
        <dialog
            ref={ref}
            className={"dialog dialog--" + variant + " " + className}
            style={style}
            aria-labelledby={title ? titleId : undefined}
            onCancel={(event) => {
                event.preventDefault();
                if (onClose) onClose();
            }}
            onClick={(event) => {
                // a click on the backdrop targets the dialog element itself
                if (event.target === ref.current && onClose) onClose();
            }}
        >
            {open && (
                <div className="dialog__panel">
                    <div className="dialog__head">
                        {title && (
                            <h2 className="dialog__title" id={titleId}>
                                {title}
                            </h2>
                        )}
                        {onClose && (
                            <button type="button" className="dialog__close" onClick={onClose}>
                                <Icon name="close" title="Fermer" />
                            </button>
                        )}
                    </div>
                    <div className="dialog__body">{children}</div>
                    {footer && <div className="dialog__foot">{footer}</div>}
                </div>
            )}
        </dialog>
    );
};

export const ConfirmDialog = ({
    open,
    title,
    content,
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
    danger = false,
    onConfirm,
    onCancel,
}) => (
    <Dialog
        open={open}
        onClose={onCancel}
        title={title}
        footer={
            <>
                <Button variant="ghost" onClick={onCancel}>
                    {cancelLabel}
                </Button>
                <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </>
        }
    >
        <p>{content}</p>
    </Dialog>
);

export const Field = ({
    label,
    name,
    type = "text",
    error = false,
    required = false,
    textarea = false,
    hint,
    id,
    className = "",
    ...inputProps
}) => {
    const autoId = useId();
    const inputId = id || autoId;
    const Tag = textarea ? "textarea" : "input";

    return (
        <div className={"field" + (error ? " field--error" : "") + " " + className}>
            <label className="field__label" htmlFor={inputId}>
                {label}
                {required && (
                    <span className="field__req" aria-hidden="true">
                        {" "}
                        *
                    </span>
                )}
            </label>
            <Tag
                id={inputId}
                name={name}
                type={textarea ? undefined : type}
                className="field__input"
                aria-invalid={error || undefined}
                required={required}
                rows={textarea ? 5 : undefined}
                {...inputProps}
            />
            {hint && <span className="field__hint">{hint}</span>}
        </div>
    );
};

export const Switch = ({ checked, onChange, disabled, label }) => (
    <label className={"switch" + (disabled ? " switch--disabled" : "")}>
        <input
            type="checkbox"
            role="switch"
            checked={!!checked}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
        />
        <span className="switch__track" aria-hidden="true">
            <span className="switch__thumb" />
        </span>
        <span className="visually-hidden">{label}</span>
    </label>
);

export const Badge = ({ tone = "neutral", children, className = "" }) => (
    <span className={"badge badge--" + tone + " " + className}>{children}</span>
);

export const PageHeader = ({ kicker, title, children }) => (
    <header className="page-header">
        {kicker && <span className="kicker">{kicker}</span>}
        <h1 className="page-header__title">{title}</h1>
        {children && <div className="page-header__lead">{children}</div>}
    </header>
);
