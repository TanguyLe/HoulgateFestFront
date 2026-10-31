import React from "react";
import { Link, NavLink } from "react-router-dom";

import WhoAmI from "../../login/components/whoAmI";
import withRouter from "../../utils/withRouter";
import { Dialog, Marquee, cx } from "../../ui";
import Icon from "../../ui/icons";
import { ensureEdition, getEditionTheme, subscribeEdition } from "../../editions/editionStore";

// Desktop top bar
export const topItems = [
    { to: "/history", label: "Historique" },
    { to: "/shotgun", label: "Shotgun" },
    { to: "/trips", label: "Trajets" },
    { to: "/scores", label: "Scores" },
    { to: "/checklist", label: "Checklist" },
    { to: "/contact", label: "Contact" },
];

// Mobile bottom tab bar, the rest goes in "Plus"
const tabItems = [
    { to: "/", label: "Accueil", icon: "home", end: true },
    { to: "/shotgun", label: "Shotgun", icon: "bed" },
    { to: "/trips", label: "Trajets", icon: "car" },
    { to: "/scores", label: "Scores", icon: "trophy" },
];

const moreItems = [
    { to: "/history", label: "Gloryhoul of Fame", icon: "star" },
    { to: "/checklist", label: "Checklist", icon: "check" },
    { to: "/contact", label: "Contact", icon: "mail" },
];

const adminItem = { to: "/admin", label: "Administration", icon: "gear" };

const applyTheme = (theme) => {
    const root = document.documentElement;
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-ink", theme.accentInk);
};

class NavBar extends React.Component {
    constructor() {
        super();

        this.state = { moreOpen: false, isAdmin: false, theme: getEditionTheme() };
        this.onEdition = this.onEdition.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = subscribeEdition(this.onEdition);
        applyTheme(this.state.theme);
        ensureEdition();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            if (this.state.moreOpen) this.setState({ moreOpen: false });
            ensureEdition();
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onEdition() {
        const theme = getEditionTheme();
        applyTheme(theme);
        this.setState({ theme: theme });
    }

    render() {
        const { children, bigContainer, bare, location } = this.props;
        const { moreOpen, isAdmin, theme } = this.state;
        const extraItems = isAdmin ? moreItems.concat(adminItem) : moreItems;
        const moreActive = extraItems.some((item) => location.pathname.startsWith(item.to));

        return (
            <div className="shell">
                <a className="skip-link" href="#main">
                    Aller au contenu
                </a>
                <header className="topbar">
                    <Link to="/" className="wordmark" aria-label="HoulgateFest, accueil">
                        <span>Houlgate</span>
                        <span className="wordmark__fest">Fest</span>
                    </Link>
                    <nav className="topnav" aria-label="Navigation principale">
                        {topItems.map((item) => (
                            <NavLink key={item.to} to={item.to} className="topnav__link">
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                    <WhoAmI onAdminChange={(value) => this.setState({ isAdmin: value })} />
                </header>

                <main
                    id="main"
                    className={cx(
                        "main",
                        bare ? "main--bare" : bigContainer ? "main--wide" : "main--narrow",
                    )}
                >
                    {children}
                </main>

                <footer className="footer">
                    <Marquee
                        variant="accent"
                        items={["HoulgateFest", theme.name, "Villa Les Genêts", "Houlgate"]}
                    />
                    <div className="footer__inner">
                        <span className="display footer__brand">HoulgateFest</span>
                        <nav className="footer__links" aria-label="Liens secondaires">
                            <Link to="/history">Gloryhoul of Fame</Link>
                            <Link to="/checklist">Checklist</Link>
                            <Link to="/contact">Contact</Link>
                        </nav>
                    </div>
                </footer>

                <nav className="tabbar" aria-label="Navigation principale (mobile)">
                    {tabItems.map((item) => (
                        <NavLink key={item.to} to={item.to} end={item.end} className="tabbar__tab">
                            <Icon name={item.icon} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                    <button
                        type="button"
                        className={cx("tabbar__tab", moreActive && "active")}
                        aria-haspopup="dialog"
                        aria-expanded={moreOpen}
                        onClick={() => this.setState({ moreOpen: true })}
                    >
                        <Icon name="more" />
                        <span>Plus</span>
                    </button>
                </nav>

                {moreOpen && (
                    <Dialog title="Plus" onClose={() => this.setState({ moreOpen: false })}>
                        <ul className="more-list">
                            {extraItems.map((item) => (
                                <li key={item.to}>
                                    <NavLink to={item.to} className="more-list__link">
                                        <Icon name={item.icon} />
                                        <span>{item.label}</span>
                                        <Icon name="arrow" className="more-list__arrow" />
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </Dialog>
                )}
            </div>
        );
    }
}

export default withRouter(NavBar);
