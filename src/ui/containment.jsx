import React from "react";

import Icon from "./Icon";

const classes = (...names) => names.filter(Boolean).join(" ");

// M3 card: filled, outlined or elevated
export const Card = ({
    variant = "filled",
    as: Element = "div",
    className,
    children,
    ...props
}) => (
    <Element className={classes("md-card", "md-card--" + variant, className)} {...props}>
        {children}
    </Element>
);

// M3 list
export const List = ({ className, children, ...props }) => (
    <ul className={classes("md-list", className)} {...props}>
        {children}
    </ul>
);

// M3 list item: a leading element, a headline, supporting text and a trailing element
export const ListItem = ({
    leading,
    headline,
    supporting,
    trailing,
    className,
    children,
    ...props
}) => (
    <li className={classes("md-list-item", className)} {...props}>
        {leading && <div className="md-list-item__leading">{leading}</div>}
        <div className="md-list-item__content">
            <div className="md-list-item__headline body-large">{headline}</div>
            {supporting && <div className="md-list-item__supporting body-medium">{supporting}</div>}
            {children}
        </div>
        {trailing && <div className="md-list-item__trailing">{trailing}</div>}
    </li>
);

// M3 chips. Assist: an action. Filter: a toggle (aria-pressed). Input: a value that can be removed.
export const AssistChip = ({ icon, className, children, ...props }) => (
    <button type="button" className={classes("md-chip", "md-chip--assist", className)} {...props}>
        {icon && <Icon name={icon} className="md-chip__icon" />}
        {children}
    </button>
);

export const FilterChip = ({ selected, className, children, ...props }) => (
    <button
        type="button"
        className={classes(
            "md-chip",
            "md-chip--filter",
            selected && "md-chip--selected",
            className,
        )}
        aria-pressed={selected}
        {...props}
    >
        {selected && <Icon name="check" className="md-chip__icon" />}
        {children}
    </button>
);

export const InputChip = ({ onRemove, removeLabel, disabled, children }) => (
    <span className={classes("md-chip", "md-chip--input", disabled && "md-chip--disabled")}>
        <span className="md-chip__label">{children}</span>
        <button
            type="button"
            className="md-chip__remove"
            aria-label={removeLabel}
            title={removeLabel}
            onClick={onRemove}
            disabled={disabled}
        >
            <Icon name="close" />
        </button>
    </span>
);

const NOTICE_ICONS = { info: "info", error: "error", success: "checkCircle", warning: "schedule" };

// An inline message on a tonal container: info, success, warning or error
export const Notice = ({ tone = "info", title, icon, action, className, children, ...props }) => (
    <div
        className={classes("md-notice", "md-notice--" + tone, className)}
        role={tone === "error" ? "alert" : undefined}
        {...props}
    >
        <Icon name={icon || NOTICE_ICONS[tone]} className="md-notice__icon" />
        <div className="md-notice__content">
            {title && <p className="title-small">{title}</p>}
            <div className="body-medium">{children}</div>
            {action && <div className="md-notice__action">{action}</div>}
        </div>
    </div>
);
