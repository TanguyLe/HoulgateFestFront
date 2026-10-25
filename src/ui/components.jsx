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
