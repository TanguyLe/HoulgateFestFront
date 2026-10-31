import React, { useId } from "react";

import Icon from "./Icon";

const classes = (...names) => names.filter(Boolean).join(" ");

// The outline of an outlined field, notched where the floating label sits
const Outline = ({ label }) => (
    <fieldset className="md-field__outline" aria-hidden="true">
        <legend>
            <span>{label}</span>
        </legend>
    </fieldset>
);

// The error, or else the supporting text, under a field
const Supporting = ({ id, error, supportingText }) =>
    error || supportingText ? (
        <p id={id} className="md-field__supporting body-small">
            {error && <Icon name="error" className="md-field__error-icon" />}
            {error || supportingText}
        </p>
    ) : null;

// M3 outlined text field, a textarea when `multiline`. `error` is shown under the field.
export const TextField = ({
    label,
    error,
    supportingText,
    multiline = false,
    leadingIcon,
    className,
    id,
    required,
    ...props
}) => {
    const autoId = useId();
    const inputId = id || autoId;
    const supportingId = inputId + "-supporting";
    const Element = multiline ? "textarea" : "input";

    return (
        <div
            className={classes(
                "md-field",
                multiline && "md-field--multiline",
                leadingIcon && "md-field--with-leading-icon",
                error && "md-field--error",
                props.disabled && "md-field--disabled",
                className,
            )}
        >
            <div className="md-field__box">
                {leadingIcon && <Icon name={leadingIcon} className="md-field__leading-icon" />}
                <Element
                    id={inputId}
                    className="md-field__input"
                    placeholder=" "
                    required={required}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error || supportingText ? supportingId : undefined}
                    {...(multiline ? { rows: 5 } : { type: "text" })}
                    {...props}
                />
                <label htmlFor={inputId} className="md-field__label">
                    {label}
                    {required && <span aria-hidden="true">*</span>}
                </label>
                <Outline label={label + (required ? "*" : "")} />
            </div>
            <Supporting id={supportingId} error={error} supportingText={supportingText} />
        </div>
    );
};

// A native <select> styled as an outlined field: `options` are { value, label }
export const Select = ({
    label,
    options,
    placeholder,
    error,
    supportingText,
    className,
    id,
    ...props
}) => {
    const autoId = useId();
    const selectId = id || autoId;
    const supportingId = selectId + "-supporting";

    return (
        <div
            className={classes(
                "md-field",
                "md-field--select",
                error && "md-field--error",
                props.disabled && "md-field--disabled",
                className,
            )}
        >
            <div className="md-field__box">
                <select
                    id={selectId}
                    className="md-field__input"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error || supportingText ? supportingId : undefined}
                    {...props}
                >
                    {placeholder !== undefined && <option value="">{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <label htmlFor={selectId} className="md-field__label">
                    {label}
                </label>
                <Outline label={label} />
                <Icon name="chevronRight" className="md-field__select-arrow" />
            </div>
            <Supporting id={supportingId} error={error} supportingText={supportingText} />
        </div>
    );
};

// M3 checkbox with its label, the whole row being the target
export const Checkbox = ({ label, className, ...props }) => (
    <label className={classes("md-checkbox", props.disabled && "md-checkbox--disabled", className)}>
        <span className="md-checkbox__target">
            <input type="checkbox" className="md-checkbox__input" {...props} />
            <svg className="md-checkbox__mark" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3.5 9.5l3.5 3.5 7.5-7.5" />
            </svg>
        </span>
        <span className="md-checkbox__label">{label}</span>
    </label>
);

// M3 switch, a checkbox with the switch role. `label` may be visually hidden in tables.
export const Switch = ({ label, hideLabel = false, className, ...props }) => (
    <label className={classes("md-switch", props.disabled && "md-switch--disabled", className)}>
        <input type="checkbox" role="switch" className="md-switch__input" {...props} />
        <span className="md-switch__track" aria-hidden="true">
            <span className="md-switch__handle">
                <Icon name="check" />
            </span>
        </span>
        <span className={hideLabel ? "visually-hidden" : "md-switch__label"}>{label}</span>
    </label>
);
