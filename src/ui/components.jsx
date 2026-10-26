import React from "react";
import ReactDOM from "react-dom";

import Icon from "./icon";
import { subscribe, dismiss } from "./toast";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export const Spinner = ({ label }) => (
    <span className="spinner" role="status" aria-label={label || "Chargement"} />
);

const ALERT_ICONS = { info: "info", success: "check", error: "alert", warning: "alert" };

export const Alert = ({ tone = "info", loading, title, children }) => (
    <div className={cx("alert", "alert--" + tone)} role={tone === "error" ? "alert" : "status"}>
        {loading ? <Spinner /> : <Icon name={ALERT_ICONS[tone]} />}
        <div>
            {title && <strong>{title}</strong>}
            {title && children ? <br /> : null}
            {children}
        </div>
    </div>
);

export const Field = ({ label, error, hint, as: Control = "input", required, ...rest }) => {
    const id = rest.id || "field-" + rest.name;

    return (
        <div className={cx("field", error && "field--error")}>
            <label className="field__label" htmlFor={id}>
                {label}
                {required && (
                    <span className="field__req" aria-hidden>
                        *
                    </span>
                )}
            </label>
            <Control
                className="field__control"
                aria-invalid={error ? true : undefined}
                required={required}
                {...rest}
                id={id}
            />
            {typeof error === "string" && error ? (
                <span className="field__error">
                    <Icon name="alert" size={14} />
                    {error}
                </span>
            ) : hint ? (
                <span className="field__hint">{hint}</span>
            ) : null}
        </div>
    );
};

export const PageHeader = ({ eyebrow, title, children }) => (
    <header className="page-header">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {children && <div className="page-header__lead">{children}</div>}
    </header>
);

export const Gallery = ({ images, label }) => (
    <div className="gallery">
        <div className="gallery__track" tabIndex={0} aria-label={label || "Galerie photo"}>
            {images.map((src, index) => (
                <figure className="gallery__item" key={src}>
                    <img src={src} alt={(label || "Photo") + " " + (index + 1)} loading="lazy" />
                </figure>
            ))}
        </div>
    </div>
);

/**
 * Modal dialog rendered in a portal. Mount it only while open: it handles Escape,
 * backdrop clicks, body scroll locking and restores focus on close.
 * Becomes a bottom sheet on small screens (see ui.css).
 */
export class Dialog extends React.Component {
    constructor() {
        super();

        this.panel = React.createRef();
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onBackdrop = this.onBackdrop.bind(this);
    }

    componentDidMount() {
        this.previousFocus = document.activeElement;
        document.addEventListener("keydown", this.onKeyDown);
        document.body.classList.add("has-dialog");

        const autofocus = this.panel.current.querySelector("[autofocus], input, select");
        (autofocus || this.panel.current).focus();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
        document.body.classList.remove("has-dialog");
        if (this.previousFocus && this.previousFocus.focus) this.previousFocus.focus();
    }

    onKeyDown(event) {
        if (event.key === "Escape") this.props.onClose();
    }

    onBackdrop(event) {
        if (event.target === event.currentTarget) this.props.onClose();
    }

    render() {
        const { id, title, subtitle, wide, children, onClose } = this.props;
        const titleId = (id || "dialog") + "-title";

        return ReactDOM.createPortal(
            <div className="dialog-backdrop" onMouseDown={this.onBackdrop}>
                <div
                    className={cx("dialog", wide && "dialog--wide")}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    id={id}
                    tabIndex={-1}
                    ref={this.panel}
                >
                    <div className="dialog__header">
                        <div>
                            <h2 id={titleId}>{title}</h2>
                            {subtitle && <div className="dialog__subtitle">{subtitle}</div>}
                        </div>
                        <button
                            type="button"
                            className="btn btn--ghost btn--icon"
                            onClick={onClose}
                            aria-label="Fermer"
                        >
                            <Icon name="x" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>,
            document.body,
        );
    }
}

/**
 * Dialog asking to confirm an action. Mount it only while open, like Dialog.
 * `danger` styles the confirm button as destructive.
 */
export const ConfirmDialog = ({ title, confirmLabel, danger, onConfirm, onClose, children }) => (
    <Dialog id="confirm-dialog" title={title} onClose={onClose}>
        {children && <div className="dialog__body">{children}</div>}
        <div className="form__actions">
            <button type="button" className="btn" onClick={onClose}>
                Annuler
            </button>
            <button
                type="button"
                className={cx("btn", danger ? "btn--danger" : "btn--primary")}
                onClick={onConfirm}
                autoFocus
            >
                {confirmLabel || "Confirmer"}
            </button>
        </div>
    </Dialog>
);

/**
 * Accessible tabs: `tabs` is a list of { key, label, icon }, the active panel is the children.
 * Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern).
 */
export class Tabs extends React.Component {
    constructor() {
        super();

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(event) {
        const { tabs, active, onChange } = this.props;
        const index = tabs.findIndex((tab) => tab.key === active);
        const moves = {
            ArrowRight: index + 1,
            ArrowLeft: index - 1,
            Home: 0,
            End: tabs.length - 1,
        };

        if (!(event.key in moves)) return;
        event.preventDefault();

        const next = tabs[(moves[event.key] + tabs.length) % tabs.length];
        onChange(next.key);
        document.getElementById("tab-" + next.key).focus();
    }

    render() {
        const { tabs, active, onChange, label, children } = this.props;

        return (
            <div className="tabs">
                <div className="tabs__list" role="tablist" aria-label={label}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            id={"tab-" + tab.key}
                            type="button"
                            role="tab"
                            className="tabs__tab"
                            aria-selected={tab.key === active}
                            aria-controls={"tabpanel-" + tab.key}
                            tabIndex={tab.key === active ? 0 : -1}
                            onClick={() => onChange(tab.key)}
                            onKeyDown={this.onKeyDown}
                        >
                            {tab.icon && <Icon name={tab.icon} size={18} />}
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div
                    className="tabs__panel"
                    role="tabpanel"
                    id={"tabpanel-" + active}
                    aria-labelledby={"tab-" + active}
                >
                    {children}
                </div>
            </div>
        );
    }
}

// On/off toggle: a native checkbox with the switch role, `label` is read by screen readers
export const Switch = ({ checked, disabled, label, onChange }) => (
    <label className="switch">
        <input
            type="checkbox"
            role="switch"
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
        />
        <span className="switch__track" aria-hidden />
        <span className="visually-hidden">{label}</span>
    </label>
);

const TOAST_ICONS = { info: "info", success: "check", error: "alert" };

export class Toaster extends React.Component {
    constructor() {
        super();

        this.state = { toasts: [] };
    }

    componentDidMount() {
        this.unsubscribe = subscribe((toasts) => this.setState({ toasts }));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div className="toaster" aria-live="polite">
                {this.state.toasts.map((toast) => (
                    <div className={"toast toast--" + toast.tone} key={toast.id}>
                        <Icon name={TOAST_ICONS[toast.tone]} />
                        <div className="toast__body">{toast.message}</div>
                        <button
                            className="toast__close"
                            onClick={() => dismiss(toast.id)}
                            aria-label="Fermer"
                        >
                            <Icon name="x" size={16} />
                        </button>
                    </div>
                ))}
            </div>
        );
    }
}
