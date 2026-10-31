// The few UI building blocks of the site, styled by src/styles/ui.css
import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

const CALLOUT_ICONS = { info: "💡", success: "🎉", error: "🙈", warning: "⚠️" };

export const Callout = ({ kind = "info", icon, title, onDismiss, center, children }) => (
    <div
        className={"callout callout--" + kind + (center ? " callout--center" : "")}
        role={kind === "error" ? "alert" : "status"}
    >
        {icon !== null && (
            <span className="callout__icon emoji" aria-hidden="true">
                {icon || CALLOUT_ICONS[kind]}
            </span>
        )}
        <div className="callout__body">
            {title && <div className="callout__title">{title}</div>}
            {children}
        </div>
        {onDismiss && (
            <button
                type="button"
                className="callout__close"
                onClick={onDismiss}
                aria-label="Fermer le message"
            >
                ✕
            </button>
        )}
    </div>
);

export const Spinner = ({ label }) => (
    <span className="spinner" role={label ? "status" : undefined} aria-label={label} />
);

// Full-width loading state, with a bouncing emoji
export const Loading = ({ children, emoji = "🛎️" }) => (
    <div className="loading-block" role="status">
        <span className="emoji" aria-hidden="true">
            {emoji}
        </span>
        <span>{children}</span>
    </div>
);

// Dialog rendered in a portal: centered on desktop, a bottom sheet on phones
export const Modal = ({ title, onClose, children, footer, wide, labelledBy }) => {
    const ref = useRef(null);
    const titleId = useMemo(() => labelledBy || "modal-" + Math.random().toString(36).slice(2), []);

    useEffect(() => {
        const previous = document.activeElement;
        const onKey = (event) => {
            if (event.key === "Escape" && onClose) onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        // Focus the first field if any, the dialog otherwise
        const focusable = ref.current.querySelector("input, select, textarea");
        (focusable || ref.current).focus();

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
            if (previous && previous.focus) previous.focus();
        };
    }, []);

    return createPortal(
        <div
            className="modal-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && onClose) onClose();
            }}
        >
            <div
                className={"modal" + (wide ? " modal--wide" : "")}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                ref={ref}
            >
                <div className="modal__header">
                    <h2 className="modal__title" id={titleId}>
                        {title}
                    </h2>
                    {onClose && (
                        <button
                            type="button"
                            className="btn btn--icon btn--ghost modal__close"
                            onClick={onClose}
                            aria-label="Fermer"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {children}
                {footer && <div className="modal__footer">{footer}</div>}
            </div>
        </div>,
        document.body,
    );
};

// A confirmation dialog, the replacement of Semantic's Confirm
export const Confirm = ({ open, header, content, confirmLabel, danger, onCancel, onConfirm }) =>
    open ? (
        <Modal
            title={header}
            onClose={onCancel}
            footer={[
                <button key="cancel" type="button" className="btn" onClick={onCancel}>
                    Annuler
                </button>,
                <button
                    key="confirm"
                    type="button"
                    className={"btn " + (danger ? "btn--danger" : "btn--primary")}
                    onClick={onConfirm}
                >
                    {confirmLabel || "Confirmer"}
                </button>,
            ]}
        >
            <p>{content}</p>
        </Modal>
    ) : null;

/* -------------------------------------------------------------------- Avatars */

const AVATAR_COLORS = ["#ffc2d6", "#ffe066", "#bdf2dc", "#cfe0ff", "#e2d4ff", "#ffd2b8"];

export const getInitials = (name) => {
    const clean = String(name || "?").trim();
    const words = clean.split(/[\s._-]+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return clean.slice(0, 2).toUpperCase();
};

const getAvatarColor = (name) => {
    let hash = 0;
    for (const char of String(name || "")) hash = (hash * 31 + char.charCodeAt(0)) | 0;
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const Avatar = ({ name, size, empty, title }) =>
    empty ? (
        <span className={"avatar avatar--empty" + (size ? " avatar--" + size : "")} title={title}>
            <span aria-hidden="true">+</span>
        </span>
    ) : (
        <span
            className={"avatar" + (size ? " avatar--" + size : "")}
            style={{ "--avatar-bg": getAvatarColor(name) }}
            title={title || name}
            aria-label={name}
            role="img"
        >
            {getInitials(name)}
        </span>
    );

export const AvatarStack = ({ names, max = 12, size }) => {
    const shown = names.slice(0, max);
    return (
        <div className="avatar-stack">
            {shown.map((name, index) => (
                <Avatar key={name + index} name={name} size={size} />
            ))}
            {names.length > max && (
                <span className="avatar-stack__more">+{names.length - max}</span>
            )}
        </div>
    );
};

/* -------------------------------------------------------------------- Countdown */

const pad = (value) => String(value).padStart(2, "0");

// Display only: `timeLeft` is { days, hours, min, sec }
export const CountdownTiles = ({ timeLeft, small, label }) => {
    const units = [
        [timeLeft.days, "Jour", "Jours"],
        [timeLeft.hours, "Heure", "Heures"],
        [timeLeft.min, "Minute", "Minutes"],
        [timeLeft.sec, "Seconde", "Secondes"],
    ];
    return (
        <div
            className={"countdown" + (small ? " countdown--sm" : "")}
            role="timer"
            aria-label={label}
        >
            {units.map(([value, one, many]) => (
                <span className="countdown__tile" key={many}>
                    <span className="countdown__value">{pad(value)}</span>
                    <span className="countdown__unit">{value === 1 ? one : many}</span>
                </span>
            ))}
        </div>
    );
};

/* -------------------------------------------------------------------- Confetti */

const CONFETTI_COLORS = ["#ff5d8f", "#ffb703", "#3ec5a0", "#4d8dff", "#9b6bff", "#ff7f3f"];

// A burst of CSS confetti, hidden when the user prefers reduced motion
export const Confetti = ({ pieces = 70 }) => {
    const style = useMemo(
        () =>
            Array.from({ length: pieces }, (_, index) => ({
                left: Math.random() * 100 + "%",
                background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
                "--delay": (Math.random() * 0.6).toFixed(2) + "s",
                "--fall": (2.2 + Math.random() * 1.6).toFixed(2) + "s",
                "--drift": Math.round(Math.random() * 160 - 80) + "px",
                "--spin": Math.round(360 + Math.random() * 720) + "deg",
            })),
        [pieces],
    );

    return createPortal(
        <div className="confetti" aria-hidden="true">
            {style.map((pieceStyle, index) => (
                <span key={index} className="confetti__piece" style={pieceStyle} />
            ))}
        </div>,
        document.body,
    );
};

/* -------------------------------------------------------------------- Form fields */

// A labelled input (or textarea with `multiline`), every other prop goes to the input
export const Field = ({ label, error, required, multiline, id, name, ...inputProps }) => {
    const fieldId = id || "field-" + name;
    const Tag = multiline ? "textarea" : "input";
    return (
        <div className="field">
            <label className="field__label" htmlFor={fieldId}>
                {label}
                {required && (
                    <span className="req" aria-hidden="true">
                        *
                    </span>
                )}
            </label>
            <Tag
                id={fieldId}
                name={name}
                className={multiline ? "textarea" : "input"}
                aria-invalid={error ? "true" : undefined}
                required={required}
                {...inputProps}
            />
        </div>
    );
};

// The error messages of a form, as a list in an error callout
export const ErrorList = ({ messages }) => {
    const shown = messages.filter(Boolean);
    if (!shown.length) return null;
    return (
        <Callout kind="error" title="Petit souci...">
            <ul>
                {shown.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </Callout>
    );
};

export const Switch = ({ checked, disabled, onChange, label }) => (
    <span className="switch">
        <input
            type="checkbox"
            role="switch"
            checked={!!checked}
            disabled={disabled}
            aria-label={label}
            onChange={(event) => onChange(event.target.checked)}
        />
        <span className="switch__track" />
    </span>
);

export const Tabs = ({ tabs, active, onChange, label }) => (
    <div className="tabs" role="tablist" aria-label={label}>
        {tabs.map((tab) => (
            <button
                key={tab.key}
                type="button"
                role="tab"
                className="tabs__tab"
                aria-selected={active === tab.key}
                onClick={() => onChange(tab.key)}
            >
                {tab.emoji && (
                    <span className="emoji" aria-hidden="true">
                        {tab.emoji}
                    </span>
                )}
                {tab.label}
            </button>
        ))}
    </div>
);
