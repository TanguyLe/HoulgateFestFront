import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Button, Dialog, Icon, btnClass } from "../../ui";
import LogInForm from "../../login/components/forms/logInForm";
import { logout } from "../../login/store";
import { onLoginRequest, openLogin, useSession } from "../../login/session";

export const NAV_ITEMS = [
    { to: "/", label: "Accueil", icon: "home", end: true },
    { to: "/shotgun", label: "Shotgun", icon: "bed" },
    { to: "/trips", label: "Trajets", icon: "car" },
    { to: "/scores", label: "Scores", icon: "trophy" },
    { to: "/history", label: "Historique", icon: "history" },
    { to: "/checklist", label: "Checklist", icon: "checklist" },
    { to: "/contact", label: "Contact", icon: "mail" },
];

// The thumb-friendly tabs on phones, the rest goes in the "Plus" sheet
const TAB_KEYS = ["/", "/shotgun", "/trips", "/scores"];

const initials = (name = "") =>
    name
        .split(/[\s._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "?";

export const Wordmark = ({ year }) => (
    <Link to="/" className="wordmark" aria-label="HoulgateFest, accueil">
        <span className="wordmark__sun" aria-hidden="true" />
        <span className="wordmark__text">
            Houlgate<span className="wordmark__fest">Fest</span>
        </span>
        {year ? <span className="wordmark__year">{year}</span> : null}
    </Link>
);

const UserChip = ({ session }) => (
    <div className="userchip">
        {session.isAdmin && (
            <Link to="/admin" className={btnClass("ghost", "sm")} title="Administration">
                <Icon name="settings" size={18} />
                <span>Admin</span>
            </Link>
        )}
        <span className="userchip__who">
            <span className="avatar" aria-hidden="true">
                {initials(session.login)}
            </span>
            <span className="userchip__name">{session.login}</span>
        </span>
        <Button variant="ghost" size="sm" icon="logout" onClick={logout} title="Déconnexion">
            Déconnexion
        </Button>
    </div>
);

const TopBar = ({ session, year, onOpenMore }) => (
    <header className="topbar">
        <div className="topbar__inner">
            <Wordmark year={year} />
            <nav className="topbar__nav" aria-label="Navigation principale">
                {NAV_ITEMS.filter((item) => item.to !== "/").map((item) => (
                    <NavLink key={item.to} to={item.to} className="topbar__link" end={item.end}>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="topbar__account">
                {!session.ready ? null : session.login ? (
                    <UserChip session={session} />
                ) : (
                    <Button variant="primary" size="sm" icon="login" onClick={openLogin}>
                        Connexion
                    </Button>
                )}
            </div>
            <button
                type="button"
                className="topbar__mobile-account"
                onClick={session.login ? onOpenMore : openLogin}
                aria-label={session.login ? "Mon compte : " + session.login : "Connexion"}
            >
                {session.login ? (
                    <span className="avatar">{initials(session.login)}</span>
                ) : (
                    <>
                        <Icon name="user" size={18} />
                        <span>Connexion</span>
                    </>
                )}
            </button>
        </div>
    </header>
);

const TabBar = ({ onOpenMore, moreOpen }) => {
    const { pathname } = useLocation();
    const inMore = !TAB_KEYS.some((key) =>
        key === "/" ? pathname === "/" : pathname.startsWith(key),
    );

    return (
        <nav className="tabbar" aria-label="Navigation">
            {NAV_ITEMS.filter((item) => TAB_KEYS.includes(item.to)).map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className="tabbar__item">
                    <Icon name={item.icon} size={22} />
                    <span>{item.label}</span>
                </NavLink>
            ))}
            <button
                type="button"
                className={"tabbar__item" + (inMore ? " active" : "")}
                onClick={onOpenMore}
                aria-expanded={moreOpen}
            >
                <Icon name="menu" size={22} />
                <span>Plus</span>
            </button>
        </nav>
    );
};

const MoreSheet = ({ open, onClose, session }) => (
    <Dialog open={open} onClose={onClose} title="Toutes les escales" variant="sheet">
        <ul className="more-list">
            {NAV_ITEMS.filter((item) => !TAB_KEYS.includes(item.to)).map((item) => (
                <li key={item.to}>
                    <NavLink to={item.to} className="more-list__link" onClick={onClose}>
                        <Icon name={item.icon} />
                        <span>{item.label}</span>
                        <Icon name="chevronRight" size={18} className="more-list__chev" />
                    </NavLink>
                </li>
            ))}
            {session.isAdmin && (
                <li>
                    <NavLink to="/admin" className="more-list__link" onClick={onClose}>
                        <Icon name="settings" />
                        <span>Administration</span>
                        <Icon name="chevronRight" size={18} className="more-list__chev" />
                    </NavLink>
                </li>
            )}
        </ul>
        <div className="more-account">
            {session.login ? (
                <>
                    <span className="userchip__who">
                        <span className="avatar" aria-hidden="true">
                            {initials(session.login)}
                        </span>
                        <span>
                            Connecté en tant que <b>{session.login}</b>
                        </span>
                    </span>
                    <Button
                        variant="danger-ghost"
                        size="sm"
                        icon="logout"
                        onClick={() => {
                            logout();
                            onClose();
                        }}
                    >
                        Déconnexion
                    </Button>
                </>
            ) : (
                <Button
                    variant="primary"
                    className="btn--block"
                    icon="login"
                    onClick={() => {
                        onClose();
                        openLogin();
                    }}
                >
                    Connexion
                </Button>
            )}
        </div>
    </Dialog>
);

const LoginDialog = ({ open, onClose }) => {
    const navigate = useNavigate();

    return (
        <Dialog open={open} onClose={onClose} title="Connecte-toi" className="login-dialog">
            <p className="muted small" id="loginPortal">
                Ton billet pour Houlgate : un email, un mot de passe, et c’est parti.
            </p>
            <LogInForm history={{ push: navigate }} toClose={onClose} />
        </Dialog>
    );
};

const NavBar = ({ children, width = "text", year }) => {
    const session = useSession();
    const { pathname } = useLocation();
    const [moreOpen, setMoreOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => onLoginRequest(() => setLoginOpen(true)), []);

    // Close everything when navigating, and the login once logged in
    useEffect(() => {
        setMoreOpen(false);
        setLoginOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (session.login) setLoginOpen(false);
    }, [session.login]);

    return (
        <div className="shell">
            <a className="skip-link" href="#content">
                Aller au contenu
            </a>
            <TopBar session={session} year={year} onOpenMore={() => setMoreOpen(true)} />
            <main id="content" className={"main main--" + width}>
                {children}
            </main>
            <footer className="footer">
                <div className="footer__stripes" aria-hidden="true" />
                <div className="footer__inner">
                    <span className="footer__brand">HoulgateFest</span>
                    <span>Villa Les Genêts · Houlgate · Côte Fleurie</span>
                    <Link to="/contact">Une question ? Écris-nous</Link>
                </div>
            </footer>
            <TabBar onOpenMore={() => setMoreOpen(true)} moreOpen={moreOpen} />
            <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} session={session} />
            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
        </div>
    );
};

export default NavBar;
