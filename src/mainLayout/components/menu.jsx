import React from "react";
import { Link, NavLink } from "react-router-dom";

import withRouter from "../../utils/withRouter";
import WhoAmI from "../../login/components/whoAmI";
import Icon from "../../ui/icon";
import { Toaster } from "../../ui/components";

export const NAV_ITEMS = [
    { to: "/shotgun", label: "Shotgun", icon: "bed" },
    { to: "/trips", label: "Trajets", icon: "car" },
    { to: "/scores", label: "Scores", icon: "trophy" },
    { to: "/history", label: "Historique", icon: "history" },
    { to: "/checklist", label: "Checklist", icon: "check" },
    { to: "/contact", label: "Contact", icon: "mail" },
];

const NavLinks = () => (
    <ul className="nav">
        {NAV_ITEMS.map((item) => (
            <li key={item.to}>
                <NavLink
                    to={item.to}
                    className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}
                >
                    {item.label}
                </NavLink>
            </li>
        ))}
    </ul>
);

const THEME_KEY = "theme";

const currentTheme = () =>
    document.documentElement.dataset.theme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

// Flips between light and dark and remembers the choice (applied before paint in index.html)
class ThemeToggle extends React.Component {
    constructor() {
        super();

        this.state = { theme: currentTheme() };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        const theme = this.state.theme === "dark" ? "light" : "dark";

        document.documentElement.dataset.theme = theme;
        try {
            window.localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            // Private mode: the choice just won't survive a reload
        }
        this.setState({ theme });
    }

    render() {
        const toDark = this.state.theme !== "dark";

        return (
            <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={this.toggle}
                aria-label={toDark ? "Passer en thème sombre" : "Passer en thème clair"}
                title={toDark ? "Thème sombre" : "Thème clair"}
            >
                <Icon name={toDark ? "moon" : "sun"} />
            </button>
        );
    }
}

export const Wordmark = () => (
    <Link to="/" className="wordmark" aria-label="HoulgateFest, accueil">
        Houlgate<em>Fest</em>
    </Link>
);

/**
 * Persistent shell around every page: sticky glass top bar, full-screen mobile drawer,
 * footer and the toast outlet. Mounted once so WhoAmI restores the session only once.
 */
class AppShell extends React.Component {
    constructor() {
        super();

        this.state = { drawerOpen: false };
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            window.scrollTo(0, 0);
            if (this.state.drawerOpen) this.setState({ drawerOpen: false });
        }
    }

    toggleDrawer() {
        this.setState({ drawerOpen: !this.state.drawerOpen });
    }

    render() {
        const { drawerOpen } = this.state;

        return (
            <div className="shell">
                <a className="visually-hidden" href="#main">
                    Aller au contenu
                </a>
                <header className="topbar">
                    <div className="topbar__inner">
                        <button
                            type="button"
                            className="btn btn--ghost btn--icon topbar__burger"
                            onClick={this.toggleDrawer}
                            aria-expanded={drawerOpen}
                            aria-controls="drawer"
                            aria-label={drawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        >
                            <Icon name={drawerOpen ? "x" : "menu"} />
                        </button>
                        <Wordmark />
                        <nav aria-label="Navigation principale">
                            <NavLinks />
                        </nav>
                        <div className="topbar__user">
                            <ThemeToggle />
                            <WhoAmI />
                        </div>
                    </div>
                </header>
                <nav
                    id="drawer"
                    className={"drawer" + (drawerOpen ? " is-open" : "")}
                    aria-label="Menu mobile"
                >
                    <NavLinks />
                </nav>

                <main id="main">{this.props.children}</main>

                <footer className="footer">
                    <div className="footer__inner">
                        <span>
                            HoulgateFest · depuis 2018 · fait main par{" "}
                            <Link to="/contact">les orgas</Link>
                        </span>
                        <div className="footer__links">
                            {NAV_ITEMS.map((item) => (
                                <Link key={item.to} to={item.to}>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </footer>
                <Toaster />
            </div>
        );
    }
}

export default withRouter(AppShell);
