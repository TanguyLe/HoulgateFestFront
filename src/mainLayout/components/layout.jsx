import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import WhoAmI from "../../login/components/whoAmI";
import OnlyWhenConnectedWrapper from "../../utils/login/onlyWhenConnectedWrapper";
import OnlyWhenNotConnectedWrapper from "../../utils/login/onlyWhenNotConnectedWrapper";
import { currentEdition } from "../../content/currentEdition";
import { Drawer, NavigationBar, NavigationRail } from "../../ui/navigation";
import { SnackbarHost } from "../../ui";
import Logo from "./logo";
import "../layout.css";

const SITE_URL = "https://www.houlgatefest.fr";
const DEFAULT_DESCRIPTION =
    "Le site du HoulgateFest, le weekend entre amis à Houlgate : le shotgun des lits, les trajets, les scores et l'historique des éditions.";

// The 4 main destinations are in the navigation bar of phones, the others behind "Plus"
const MAIN = [
    { to: "/", end: true, label: "Accueil", icon: "home" },
    { to: "/shotgun", label: "Shotgun", icon: "bed" },
    { to: "/trips", label: "Trajets", icon: "directionsCar" },
    { to: "/scores", label: "Scores", icon: "leaderboard" },
];
const HISTORY = { to: "/history", label: "Historique", icon: "history" };
const SECONDARY = [
    HISTORY,
    { to: "/checklist", label: "Checklist", icon: "checklist" },
    { to: "/contact", label: "Contact", icon: "mail" },
];
const LINKS = [
    { href: currentEdition.shotgunGuideUrl, label: "Le guide du shotgun", icon: "menuBook" },
];

const setMeta = (selector, attribute, value) => {
    const element = document.head.querySelector(selector);
    if (element) element.setAttribute(attribute, value);
};

// Title, description, canonical URL and indexing of each page
const usePageMeta = ({ title, description, noindex }) => {
    const location = useLocation();

    useEffect(() => {
        document.title = title ? title + " · HoulgateFest" : "HoulgateFest à Houlgate";
        setMeta('meta[name="description"]', "content", description || DEFAULT_DESCRIPTION);
        setMeta('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : "index, follow");
        setMeta('link[rel="canonical"]', "href", SITE_URL + location.pathname);
    }, [title, description, noindex, location.pathname]);
};

// The frame of every page: top app bar, navigation (bar on phones, rail above 600 px, drawer for
// the rest), the page in <main>, the footer and the snackbars
const DefaultLayout = ({
    component: Component,
    bigContainer,
    auth,
    notCo,
    title,
    description,
    noindex,
}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const main = useRef(null);
    const firstRender = useRef(true);

    usePageMeta({ title, description, noindex });

    // A new page starts at the top, with the focus on it for keyboards and screen readers
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        window.scrollTo(0, 0);
        main.current.focus({ preventScroll: true });
    }, [location.pathname]);

    const openDrawer = () => setDrawerOpen(true);
    const barItems = [
        ...MAIN,
        { label: "Plus", icon: "moreHoriz", onClick: openDrawer, expanded: drawerOpen },
    ];

    let page = <Component />;
    if (auth) page = <OnlyWhenConnectedWrapper title={title}>{page}</OnlyWhenConnectedWrapper>;
    else if (notCo) page = <OnlyWhenNotConnectedWrapper>{page}</OnlyWhenNotConnectedWrapper>;

    return (
        <div className="app">
            <a href="#contenu" className="skip-link label-large">
                Aller au contenu
            </a>
            <header className="top-app-bar">
                <Link to="/" className="top-app-bar__logo">
                    <Logo />
                    <span className="visually-hidden">, accueil</span>
                </Link>
                <div className="top-app-bar__actions">
                    <WhoAmI />
                </div>
            </header>
            <NavigationRail
                items={[...MAIN, HISTORY]}
                label="Navigation principale"
                onMenu={openDrawer}
                menuExpanded={drawerOpen}
            />
            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Menu"
                sections={[
                    { title: "Le weekend", items: [...MAIN, ...SECONDARY] },
                    { title: "Liens", items: LINKS },
                ]}
            />
            <main
                id="contenu"
                ref={main}
                tabIndex={-1}
                className={"page" + (bigContainer ? " page--wide" : "")}
            >
                {page}
            </main>
            <footer className="footer body-medium">
                <nav aria-label="Liens secondaires">
                    <ul className="footer__links">
                        {SECONDARY.map((item) => (
                            <li key={item.to}>
                                <Link to={item.to}>{item.label}</Link>
                            </li>
                        ))}
                        {LINKS.map((item) => (
                            <li key={item.href}>
                                <a href={item.href} target="_blank" rel="noopener noreferrer">
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <p className="on-surface-variant">HoulgateFest, depuis 2018</p>
            </footer>
            <NavigationBar items={barItems} label="Navigation principale" />
            <SnackbarHost />
        </div>
    );
};

export default DefaultLayout;
