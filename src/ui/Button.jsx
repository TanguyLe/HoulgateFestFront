import React from "react";
import { Link } from "react-router-dom";

import Icon from "./Icon";
import { CircularProgress } from "./Progress";

const classes = (...names) => names.filter(Boolean).join(" ");

// M3 common button: filled, tonal, outlined, elevated or text. A link when given `to` (inside the
// app) or `href` (outside, opened in a new tab), a <button> otherwise.
export const Button = ({
    variant = "filled",
    icon,
    trailingIcon,
    loading = false,
    to,
    href,
    type = "button",
    className,
    children,
    ...props
}) => {
    const content = (
        <>
            {loading ? (
                <CircularProgress size="small" />
            ) : (
                icon && <Icon name={icon} className="md-button__icon" />
            )}
            <span className="md-button__label">{children}</span>
            {trailingIcon && <Icon name={trailingIcon} className="md-button__icon" />}
        </>
    );
    const className_ = classes(
        "md-button",
        "md-button--" + variant,
        (icon || loading) && "md-button--with-icon",
        trailingIcon && "md-button--with-trailing-icon",
        className,
    );

    if (to)
        return (
            <Link to={to} className={className_} {...props}>
                {content}
            </Link>
        );

    if (href)
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className_}
                {...props}
            >
                {content}
            </a>
        );

    return (
        <button
            type={type}
            className={className_}
            aria-busy={loading || undefined}
            {...props}
            disabled={props.disabled || loading}
        >
            {content}
        </button>
    );
};

// M3 icon button: standard, filled, tonal or outlined. `label` is its accessible name and tooltip.
export const IconButton = ({
    icon,
    label,
    variant = "standard",
    selected,
    to,
    className,
    type = "button",
    ...props
}) => {
    const className_ = classes(
        "md-icon-button",
        "md-icon-button--" + variant,
        selected && "md-icon-button--selected",
        className,
    );

    if (to)
        return (
            <Link to={to} className={className_} aria-label={label} title={label} {...props}>
                <Icon name={icon} filled={selected} />
            </Link>
        );

    return (
        <button
            type={type}
            className={className_}
            aria-label={label}
            title={label}
            aria-pressed={selected}
            {...props}
        >
            <Icon name={icon} filled={selected} />
        </button>
    );
};

export default Button;
