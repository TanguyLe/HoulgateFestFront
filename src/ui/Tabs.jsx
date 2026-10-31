import React, { useId, useRef } from "react";

import Icon from "./Icon";

// M3 primary tabs: `tabs` are { key, label, icon }, the panel of the selected one is `children`.
// Arrow keys move between the tabs (WAI-ARIA tabs pattern, automatic activation).
const Tabs = ({ tabs, selected, onSelect, label, children }) => {
    const id = useId();
    const list = useRef(null);

    const handleKeyDown = (event) => {
        const index = tabs.findIndex((tab) => tab.key === selected);
        const moves = { ArrowRight: 1, ArrowLeft: -1, Home: -index, End: tabs.length - 1 - index };
        if (!(event.key in moves)) return;

        event.preventDefault();
        const next = tabs[(index + moves[event.key] + tabs.length) % tabs.length];
        onSelect(next.key);
        list.current.querySelector(`[data-key="${next.key}"]`).focus();
    };

    return (
        <div className="md-tabs">
            <div
                className="md-tabs__list"
                role="tablist"
                aria-label={label}
                ref={list}
                onKeyDown={handleKeyDown}
            >
                {tabs.map((tab) => {
                    const isSelected = tab.key === selected;
                    return (
                        <button
                            key={tab.key}
                            data-key={tab.key}
                            type="button"
                            role="tab"
                            id={id + "-tab-" + tab.key}
                            aria-controls={id + "-panel"}
                            aria-selected={isSelected}
                            tabIndex={isSelected ? 0 : -1}
                            className={"md-tab" + (isSelected ? " md-tab--selected" : "")}
                            onClick={() => onSelect(tab.key)}
                        >
                            <span className="md-tab__content">
                                {tab.icon && <Icon name={tab.icon} filled={isSelected} />}
                                <span className="title-small">{tab.label}</span>
                                <span className="md-tab__indicator" />
                            </span>
                        </button>
                    );
                })}
            </div>
            <div
                className="md-tabs__panel"
                role="tabpanel"
                id={id + "-panel"}
                aria-labelledby={id + "-tab-" + selected}
                tabIndex={0}
            >
                {children}
            </div>
        </div>
    );
};

export default Tabs;
