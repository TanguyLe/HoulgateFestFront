import React from "react";

// Small, dependency-free UI kit of the site. Styles live in src/styles/ui.css.

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const Spinner = ({ label }) => (
    <span className="spinner" role={label ? "status" : undefined} aria-label={label} />
);

export const Notice = ({ type = "info", title, children, loading, onDismiss, className }) => (
    <div
        className={cx("notice", "notice--" + type, className)}
        role={type === "error" ? "alert" : "status"}
    >
        {loading && <Spinner />}
        <div className="notice__body">
            {title && <strong className="notice__title">{title}</strong>}
            {children}
        </div>
        {onDismiss && (
            <button
                type="button"
                className="notice__close"
                onClick={onDismiss}
                aria-label="Fermer le message"
            >
                ×
            </button>
        )}
    </div>
);

export const Loading = ({ children }) => (
    <Notice type="info" loading>
        {children}
    </Notice>
);

export const Tag = ({ tone, children, title }) => (
    <span className={cx("tag", tone && "tag--" + tone)} title={title}>
        {children}
    </span>
);

// Ticker band; decorative, the same information has to be readable elsewhere
export const Marquee = ({ items, variant, reverse, className }) => {
    const chunk = (key) => (
        <span className="marquee__chunk" key={key}>
            {items.map((item, index) => (
                <span className="marquee__item" key={index}>
                    {item}
                </span>
            ))}
        </span>
    );

    return (
        <div
            className={cx(
                "marquee",
                variant && "marquee--" + variant,
                reverse && "marquee--reverse",
                className,
            )}
            aria-hidden="true"
        >
            <div className="marquee__track">
                {chunk("a")}
                {chunk("b")}
                {chunk("c")}
                {chunk("d")}
            </div>
        </div>
    );
};

export const PageHead = ({ kicker, title, children, marquee }) => (
    <header className="page-head">
        <div className="page-head__inner">
            {kicker && <span className="label page-head__kicker">{kicker}</span>}
            <h1 className="page-head__title">{title}</h1>
            {children && <div className="page-head__lede">{children}</div>}
        </div>
        {marquee && <Marquee items={marquee} />}
    </header>
);

export const Field = ({ label, error, required, htmlFor, children }) => (
    <div className={cx("field", error && "field--error")}>
        <label className="field__label" htmlFor={htmlFor}>
            {label}
            {required && (
                <span className="req" aria-hidden="true">
                    {" "}
                    *
                </span>
            )}
        </label>
        {children}
    </div>
);

// Errors of a form, listed like the former semantic error message
export const ErrorList = ({ messages }) => {
    const shown = messages.filter(Boolean);
    if (!shown.length) return null;

    return (
        <Notice type="error">
            <ul>
                {shown.map((message) => (
                    <li key={message}>{message}</li>
                ))}
            </ul>
        </Notice>
    );
};

export const getInitials = (name) => {
    if (!name) return "?";
    const words = String(name)
        .trim()
        .split(/[\s._-]+/)
        .filter(Boolean);

    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
    return String(name).trim().slice(0, 2).toUpperCase();
};

export const Avatar = ({ name, empty, title }) =>
    empty ? (
        <span className="avatar avatar--empty" title={title || "Place libre"} aria-hidden="true">
            +
        </span>
    ) : (
        <span className="avatar" title={name}>
            <span aria-hidden="true">{getInitials(name)}</span>
            <span className="visually-hidden">{name}</span>
        </span>
    );

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Modal dialog (a bottom sheet on phones): Escape and a click on the backdrop close it
export class Dialog extends React.Component {
    constructor(props) {
        super(props);

        this.panel = React.createRef();
        this.onKeyDown = this.onKeyDown.bind(this);
        this.titleId = "dialog-" + Math.random().toString(36).slice(2, 9);
    }

    componentDidMount() {
        this.previousFocus = document.activeElement;
        document.addEventListener("keydown", this.onKeyDown);
        document.body.style.overflow = "hidden";

        const panel = this.panel.current;
        const first = panel && panel.querySelector(".dialog__body " + FOCUSABLE);
        (first || panel).focus();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
        document.body.style.overflow = "";
        if (this.previousFocus && this.previousFocus.focus && document.contains(this.previousFocus))
            this.previousFocus.focus();
    }

    onKeyDown(event) {
        if (event.key === "Escape" && this.props.onClose) this.props.onClose();

        // keeps the keyboard focus inside the dialog
        if (event.key === "Tab" && this.panel.current) {
            const items = this.panel.current.querySelectorAll(FOCUSABLE);
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                last.focus();
                event.preventDefault();
            } else if (!event.shiftKey && document.activeElement === last) {
                first.focus();
                event.preventDefault();
            }
        }
    }

    render() {
        const { title, children, actions, onClose, className } = this.props;

        return (
            <div
                className="overlay"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget && onClose) onClose();
                }}
            >
                <div
                    className={cx("dialog", className)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={this.titleId}
                    ref={this.panel}
                    tabIndex={-1}
                >
                    <div className="dialog__head">
                        <h2 className="dialog__title" id={this.titleId}>
                            {title}
                        </h2>
                        {onClose && (
                            <button
                                type="button"
                                className="dialog__close"
                                onClick={onClose}
                                aria-label="Fermer"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <div className="dialog__body">{children}</div>
                    {actions && <div className="dialog__actions">{actions}</div>}
                </div>
            </div>
        );
    }
}

export const Confirm = ({ open, header, content, confirmLabel, danger, onCancel, onConfirm }) =>
    open ? (
        <Dialog
            title={header}
            onClose={onCancel}
            actions={[
                <button key="cancel" type="button" className="btn" onClick={onCancel}>
                    Annuler
                </button>,
                <button
                    key="confirm"
                    type="button"
                    className={cx("btn", danger ? "btn--danger" : "btn--primary")}
                    onClick={onConfirm}
                >
                    {confirmLabel || "Confirmer"}
                </button>,
            ]}
        >
            <p>{content}</p>
        </Dialog>
    ) : null;
