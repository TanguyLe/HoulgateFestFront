import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./home/home.css";
import { useNow, useLogin, useBookedPeople } from "./home/hooks";
import {
    InviteCard,
    HomeCountdown,
    Preflight,
    QuickLinks,
    WhoIsComing,
    EditionStory,
    PreviewBar,
} from "./home/components";
import { useCurrentEdition } from "../editions/currentEdition";
import { getTheme, getThemeStyle, LATEST_THEME_YEAR } from "../editions/themes";
import {
    getPhase,
    getPreviewEdition,
    getPreviewPhase,
    formatDateTime,
    formatWeekend,
    formatDay,
    daysBetween,
} from "../editions/phase";
import { openLoginDialog } from "../login/loginDialog";

const DEFAULT_STAY_TUNED =
    "Pour être notifié directement au moment du Shotgun et au courant de toutes les actualités : rendez-vous sur le groupe WhatsApp de l’évènement !";
const PLACE = "Villa Les Genêts, Houlgate";

/* -------------------------------------------------------------------- One block per phase */

const Teaser = ({ theme, edition, loading, now, login }) => {
    const shotgunLabel = edition ? formatDateTime(edition.shotgunDate) : theme.shotgunLabel;
    const knownAccount = !!window.localStorage.getItem("username");

    return (
        <>
            <InviteCard
                theme={theme}
                kicker="Tu es invité·e à"
                title={theme.name}
                subtitle={theme.subtitle ? "— " + theme.subtitle + " —" : theme.tagline}
                details={[
                    ["📅", edition ? formatWeekend(edition.weekendDate) : theme.datesLabel],
                    ["📍", PLACE],
                    ["🛏️", shotgunLabel && "Shotgun des lits " + shotgunLabel],
                ].filter(([, text]) => text)}
            >
                <HomeCountdown
                    label="Ouverture du shotgun dans"
                    target={edition && new Date(edition.shotgunDate).getTime()}
                    now={now}
                    loading={loading}
                    unknown={
                        !edition && (
                            <p className="home-countdown__unknown">
                                {login ? (
                                    "La date de shotgun n'a pas encore été définie cette année. Reviens plus tard !"
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="link-btn"
                                            onClick={openLoginDialog}
                                        >
                                            Connecte-toi
                                        </button>{" "}
                                        pour voir le compte à rebours du shotgun ⏳
                                    </>
                                )}
                            </p>
                        )
                    }
                />
                {shotgunLabel && (
                    <p className="invite__note">
                        Soyez présents {shotgunLabel} sur cette plateforme pour choisir votre
                        meilleur hamac !
                    </p>
                )}
            </InviteCard>
            <Preflight
                login={login}
                knownAccount={knownAccount}
                stayTuned={theme.stayTuned || DEFAULT_STAY_TUNED}
                shotgunLabel={shotgunLabel}
            />
            <EditionStory theme={theme} withLogistics />
        </>
    );
};

const Shotgun = ({ theme, edition, now, login }) => {
    const shotgunTime = new Date(edition.shotgunDate).getTime();
    const open = now >= shotgunTime;

    return (
        <>
            <InviteCard
                theme={theme}
                kicker={theme.name}
                title={open ? "Le shotgun est ouvert !" : "C'est l'heure du shotgun !"}
                subtitle={
                    open
                        ? "Vite, les meilleurs lits partent en premier. Que le plus rapide gagne !"
                        : "Échauffe tes doigts, le shotgun ouvre " +
                          formatDateTime(edition.shotgunDate) +
                          "."
                }
            >
                {!open && <HomeCountdown label="Ouverture dans" target={shotgunTime} now={now} />}
                <div className="invite__cta">
                    {login ? (
                        <Link to="/shotgun" className="btn btn--primary btn--lg btn--pulse">
                            <span className="emoji" aria-hidden="true">
                                🛏️
                            </span>
                            {open ? "Je shotgun mon lit" : "Aller sur la page du shotgun"}
                        </Link>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn btn--primary btn--lg btn--pulse"
                                onClick={openLoginDialog}
                            >
                                <span className="emoji" aria-hidden="true">
                                    🔑
                                </span>
                                Je me connecte d'abord
                            </button>
                            <p className="small muted">
                                Le shotgun n'est accessible qu'une fois connecté.
                            </p>
                        </>
                    )}
                </div>
                {theme.bedNote && <p className="invite__note">{theme.bedNote}</p>}
            </InviteCard>
            {!login && (
                <Preflight
                    login={login}
                    knownAccount={!!window.localStorage.getItem("username")}
                    stayTuned={theme.stayTuned || DEFAULT_STAY_TUNED}
                />
            )}
        </>
    );
};

const Countdown = ({ theme, edition, now, people }) => {
    const weekendTime = new Date(edition.weekendDate).getTime();
    const days = daysBetween(now, weekendTime);

    return (
        <>
            <InviteCard
                theme={theme}
                kicker="Le shotgun est plié, place à l'impatience"
                title={days > 1 ? "Plus que " + days + " dodos !" : "C'est (presque) demain !"}
                subtitle={theme.name + (theme.subtitle ? " — " + theme.subtitle : "")}
                details={[
                    ["📅", formatWeekend(edition.weekendDate)],
                    ["📍", PLACE],
                ]}
            >
                <HomeCountdown label="Le weekend commence dans" target={weekendTime} now={now} />
            </InviteCard>
            <QuickLinks
                links={[
                    {
                        to: "/trips",
                        emoji: "🚗",
                        title: "Trajets",
                        text: "Trouve une place dans une voiture (ou propose la tienne).",
                    },
                    {
                        to: "/checklist",
                        emoji: "✅",
                        title: "Checklist",
                        text: "Draps, matelas, déguisement... rien d'oublié ?",
                    },
                    {
                        to: "/shotgun",
                        emoji: "🛏️",
                        title: "Qui dort où ?",
                        text: "Les chambres et leurs heureux occupants.",
                    },
                ]}
            />
            <WhoIsComing people={people} />
            <EditionStory theme={theme} />
        </>
    );
};

const Live = ({ theme, edition, now, people }) => {
    const weekendTime = new Date(edition.weekendDate).getTime();
    const day = Math.min(3, Math.max(1, daysBetween(weekendTime, now + 1)));

    return (
        <>
            <InviteCard
                theme={theme}
                kicker={"Jour " + day + " sur 3 · " + formatDay(now)}
                title={"C'est le weekend !"}
                subtitle={
                    theme.name +
                    " bat son plein à Houlgate. Profitez, hydratez-vous, et suivez les scores en direct !"
                }
            >
                <div className="invite__cta">
                    <Link to="/scores" className="btn btn--primary btn--lg">
                        <span className="emoji" aria-hidden="true">
                            🏆
                        </span>
                        Le tableau des scores
                    </Link>
                </div>
            </InviteCard>
            <QuickLinks
                links={[
                    {
                        to: "/scores",
                        emoji: "🏆",
                        title: "Scores en direct",
                        text: "Qui mène la danse ?",
                        big: true,
                    },
                    { to: "/trips", emoji: "🚗", title: "Trajets", text: "Pour le retour aussi !" },
                    { to: "/shotgun", emoji: "🛏️", title: "Qui dort où ?" },
                    { to: "/checklist", emoji: "✅", title: "Checklist" },
                ]}
            />
            <WhoIsComing people={people} />
        </>
    );
};

const Recap = ({ theme }) => (
    <>
        <InviteCard
            theme={theme}
            kicker={theme.name + " · c'est fini"}
            title={
                <>
                    Merci à tous !{" "}
                    <span className="emoji" aria-hidden="true">
                        💖
                    </span>
                </>
            }
            subtitle="Les valises sont défaites, les voix sont cassées, mais les souvenirs restent. Rendez-vous l'année prochaine pour un nouveau shotgun !"
        >
            <div className="invite__cta">
                <Link to="/history" className="btn btn--primary btn--lg">
                    <span className="emoji" aria-hidden="true">
                        📸
                    </span>
                    Le Gloryhoul of Fame
                </Link>
                <Link to="/scores" className="btn">
                    Revoir les scores
                </Link>
            </div>
        </InviteCard>
        <EditionStory theme={theme} />
    </>
);

/* -------------------------------------------------------------------- The page */

const Homepage = () => {
    const location = useLocation();
    const now = useNow();
    const login = useLogin();
    const { loading, edition: currentEdition } = useCurrentEdition();

    const previewPhase = getPreviewPhase(location.search);
    const previewYear = Number(new URLSearchParams(location.search).get("year")) || null;

    const year = previewYear || (currentEdition ? currentEdition.year : LATEST_THEME_YEAR);
    // The preview dates are computed once per phase, so the countdowns keep ticking
    const previewEdition = React.useMemo(
        () => (previewPhase ? getPreviewEdition(previewPhase, year, Date.now()) : null),
        [previewPhase, year],
    );
    const edition = previewEdition || currentEdition;
    const theme = getTheme(year);
    const phase = previewPhase || getPhase(edition, now);

    const wantsPeople = !!login && (phase === "countdown" || phase === "live");
    const people = useBookedPeople(wantsPeople && !loading);

    // Without known dates, only the teaser makes sense
    const props = { theme, edition, loading: loading && !edition, now, login, people };
    let content;
    if (!edition || phase === "teaser") content = <Teaser {...props} />;
    else if (phase === "shotgun") content = <Shotgun {...props} />;
    else if (phase === "countdown") content = <Countdown {...props} />;
    else if (phase === "live") content = <Live {...props} />;
    else content = <Recap {...props} />;

    return (
        <div className={"home home--" + phase} style={getThemeStyle(theme)}>
            {previewPhase && <PreviewBar phase={previewPhase} search={location.search} />}
            {content}
        </div>
    );
};

export default Homepage;
