import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import Icon from "./Icon";
import { placeSnackbars } from "./Snackbar";
import { IconButton } from "./Button";

// One destination of the navigation bar or rail: a link, or a button (`onClick`) like "Plus"
const NavItem = ({ item }) => {
    const content = (isActive) => (
        <>
            <span className="md-nav-item__indicator">
                <Icon name={item.icon} filled={isActive} />
            </span>
            <span className="md-nav-item__label label-medium">{item.label}</span>
        </>
    );

    if (item.onClick)
        return (
            <button
                type="button"
                className="md-nav-item"
                onClick={item.onClick}
                aria-haspopup="dialog"
                aria-expanded={item.expanded}
            >
                {content(item.expanded)}
            </button>
        );

    return (
        <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) => "md-nav-item" + (isActive ? " md-nav-item--active" : "")}
        >
            {({ isActive }) => content(isActive)}
        </NavLink>
    );
};

// M3 navigation bar, at the bottom of compact screens
export const NavigationBar = ({ items, label }) => (
    <nav className="md-navigation-bar" aria-label={label}>
        {items.map((item) => (
            <NavItem key={item.to || item.label} item={item} />
        ))}
    </nav>
);

// M3 navigation rail, on the left of medium and expanded screens, with a menu button on top
export const NavigationRail = ({ items, label, onMenu, menuExpanded }) => (
    <nav className="md-navigation-rail" aria-label={label}>
        <IconButton
            icon="menu"
            label="Ouvrir le menu"
            onClick={onMenu}
            aria-haspopup="dialog"
            aria-expanded={menuExpanded}
            className="md-navigation-rail__menu"
        />
        <div className="md-navigation-rail__items">
            {items.map((item) => (
                <NavItem key={item.to || item.label} item={item} />
            ))}
        </div>
    </nav>
);

// M3 modal navigation drawer, on a native modal <dialog>. `sections` are { title, items }, items
// being links inside the app ({ to, label, icon }) or outside it ({ href, label, icon }).
export const Drawer = ({ open, onClose, title, sections }) => {
    const dialog = useRef(null);
    const opener = useRef(null);

    useEffect(() => {
        const element = dialog.current;
        if (open && !element.open) {
            opener.current = document.activeElement;
            element.showModal();
            // The snackbars move into the dialog, the rest of the page being inert
            placeSnackbars();
        } else if (!open && element.open) element.close();
    }, [open]);

    const handleClose = () => {
        placeSnackbars();
        // Back to the menu button, unless a link of the drawer moved the focus to the new page
        const active = document.activeElement;
        const focusLost = !active || active === document.body || dialog.current.contains(active);
        if (focusLost && opener.current && opener.current.isConnected) opener.current.focus();
        if (open) onClose();
    };

    const handleClick = (event) => {
        if (event.target === dialog.current) dialog.current.close();
    };

    return (
        <dialog
            ref={dialog}
            className="md-drawer"
            aria-label={title}
            onClose={handleClose}
            onClick={handleClick}
        >
            <div className="md-drawer__container">
                <div className="md-drawer__header">
                    <p className="title-small on-surface-variant">{title}</p>
                    <IconButton icon="close" label="Fermer le menu" onClick={onClose} />
                </div>
                {sections.map((section) => (
                    <nav key={section.title} aria-label={section.title}>
                        <p className="md-drawer__section title-small on-surface-variant">
                            {section.title}
                        </p>
                        <ul className="md-drawer__list">
                            {section.items.map((item) => (
                                <li key={item.to || item.href}>
                                    {item.to ? (
                                        <NavLink
                                            to={item.to}
                                            end={item.end}
                                            className={({ isActive }) =>
                                                "md-drawer__item label-large" +
                                                (isActive ? " md-drawer__item--active" : "")
                                            }
                                            onClick={onClose}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <Icon name={item.icon} filled={isActive} />
                                                    {item.label}
                                                </>
                                            )}
                                        </NavLink>
                                    ) : (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="md-drawer__item label-large"
                                        >
                                            <Icon name={item.icon} />
                                            {item.label}
                                            <Icon
                                                name="openInNew"
                                                className="md-drawer__external"
                                            />
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>
        </dialog>
    );
};
