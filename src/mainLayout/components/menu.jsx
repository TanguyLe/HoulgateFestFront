import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import WhoAmI from "../../login/components/whoAmI";
import { Modal } from "../../ui";

export const NAV_ITEMS = [
    { to: "/", label: "Accueil", emoji: "🏠", tab: true, end: true },
    { to: "/shotgun", label: "Shotgun", emoji: "🛏️", tab: true },
    { to: "/trips", label: "Trajets", emoji: "🚗", tab: true },
    { to: "/scores", label: "Scores", emoji: "🏆", tab: true },
    { to: "/history", label: "Gloryhoul", emoji: "📸" },
    { to: "/checklist", label: "Checklist", emoji: "✅" },
    { to: "/contact", label: "Contact", emoji: "💌" },
];

const MORE_ITEMS = NAV_ITEMS.filter((item) => !item.tab);

const Brand = () => (
    <Link to="/" className="brand" aria-label="HoulgateFest, accueil">
        <span className="brand__badge emoji" aria-hidden="true">
            🏖️
        </span>
        <span className="brand__name">
            Houlgate<span>Fest</span>
        </span>
    </Link>
);

// Top bar: the brand and the user everywhere, the links on large screens only
export const TopBar = () => (
    <header className="topbar">
        <div className="topbar__inner">
            <Brand />
            <nav className="topbar__nav" aria-label="Navigation principale">
                {NAV_ITEMS.filter((item) => item.to !== "/").map((item) => (
                    <NavLink key={item.to} to={item.to} className="topbar__link">
                        <span className="emoji" aria-hidden="true">
                            {item.emoji}
                        </span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="topbar__user">
                <WhoAmI />
            </div>
        </div>
    </header>
);

// Bottom tab bar on phones and tablets, within the thumb's reach
export const TabBar = () => {
    const [moreOpen, setMoreOpen] = useState(false);
    const location = useLocation();
    const moreActive = MORE_ITEMS.some((item) => location.pathname.startsWith(item.to));

    return (
        <>
            <nav className="tabbar" aria-label="Navigation">
                {NAV_ITEMS.filter((item) => item.tab).map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.end} className="tabbar__tab">
                        <span className="tabbar__icon emoji" aria-hidden="true">
                            {item.emoji}
                        </span>
                        <span className="tabbar__label">{item.label}</span>
                    </NavLink>
                ))}
                <button
                    type="button"
                    className={"tabbar__tab" + (moreActive ? " active" : "")}
                    aria-haspopup="dialog"
                    onClick={() => setMoreOpen(true)}
                >
                    <span className="tabbar__icon emoji" aria-hidden="true">
                        ✨
                    </span>
                    <span className="tabbar__label">Plus</span>
                </button>
            </nav>
            {moreOpen && (
                <Modal title="Et aussi..." onClose={() => setMoreOpen(false)}>
                    <div className="more-grid">
                        {MORE_ITEMS.map((item, index) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="more-grid__item"
                                style={{ "--tilt": (index % 2 ? 2 : -2) + "deg" }}
                                onClick={() => setMoreOpen(false)}
                            >
                                <span className="emoji" aria-hidden="true">
                                    {item.emoji}
                                </span>
                                {item.label === "Gloryhoul" ? "Gloryhoul of Fame" : item.label}
                            </Link>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
};
