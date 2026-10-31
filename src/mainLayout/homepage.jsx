import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import useEditionTheme from "../editions/useEditionTheme";
import { PHASES } from "../editions/phase";
import { useSession, openLogin } from "../login/session";
import Countdown from "../shotgun/components/countdown";
import { Button, Icon, Notice, btnClass } from "../ui";
import { formatDay, formatDayTime, formatWeekend, weekendDayIndex } from "../utils/dates";

const SHOTGUN_GUIDE_LINK =
    "https://docs.google.com/document/d/19Yfhg8whi_AQRPlVCqYRUmmdQwRggpVxn1tbaPKCMkc/edit?usp=sharing";

const PHASE_LABELS = {
    teaser: "Teaser",
    shotgun: "Shotgun",
    countdown: "Compte à rebours",
    live: "Week-end",
    recap: "Après",
};

// Re-renders the page once a countdown is over, unless it has been left meanwhile
const useRefresh = () => {
    const mounted = useRef(true);
    const [, setTick] = useState(0);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    return useCallback(() => {
        if (mounted.current) setTick((tick) => tick + 1);
    }, []);
};

const LiveCountdown = ({ target, size, light }) => {
    const refresh = useRefresh();
    const targetDate = new Date(target);

    return (
        <Countdown
            key={targetDate.toISOString()}
            targetDatetime={targetDate}
            currentDatetime={new Date()}
            onTime={refresh}
            size={[size, light ? "light" : ""].filter(Boolean).join(" countdown--")}
        />
    );
};

/* ---------- The poster ---------- */

const Huts = () => (
    <div className="poster__huts" aria-hidden="true">
        {["a", "b", "c", "d", "a", "c", "b"].map((kind, index) => (
            <span key={index} className={"hut hut--" + kind} />
        ))}
    </div>
);

const PosterHero = ({ theme, edition }) => {
    const dates = edition && edition.weekendDate ? formatWeekend(edition.weekendDate) : null;
    const fallbackDates = theme.dates ? theme.dates + " " + theme.year : null;

    return (
        <section className="poster" aria-labelledby="poster-title">
            <div className="poster__sun" aria-hidden="true" />
            <div className="poster__sea" aria-hidden="true" />
            <Huts />
            <div className="poster__content">
                <div className="poster__text">
                    <span className="poster__kicker">
                        Houlgate <span aria-hidden="true">·</span> Côte Fleurie{" "}
                        <span aria-hidden="true">·</span> Édition {theme.year}
                    </span>
                    <h1 className="poster__title" id="poster-title">
                        {theme.name}
                    </h1>
                    {theme.subtitle && <p className="poster__subtitle">{theme.subtitle}</p>}
                    <p className="poster__tagline">{theme.tagline}</p>
                    {(dates || fallbackDates) && (
                        <p className="poster__dates">
                            <Icon name="calendar" size={18} />
                            <span>Du {dates || fallbackDates}</span>
                        </p>
                    )}
                </div>
                {theme.banner && (
                    <figure className="poster__stamp">
                        <img
                            src={theme.banner}
                            alt={"L’affiche de l’édition " + theme.year}
                            width="320"
                            height="320"
                        />
                    </figure>
                )}
            </div>
        </section>
    );
};

/* ---------- Phase panels ---------- */

const Ticket = ({ kicker, title, children, tone = "" }) => (
    <section className={"ticket " + (tone ? "ticket--" + tone : "")}>
        <div className="ticket__paper">
            <div className="ticket__head">
                <span className="kicker">{kicker}</span>
                <h2 className="ticket__title">{title}</h2>
            </div>
            <div className="ticket__body">{children}</div>
        </div>
    </section>
);

const Preflight = ({ session }) => {
    const steps = [
        {
            key: "account",
            done: !!session.login,
            title: "Créer mon compte",
            text: "Un compte par personne : c’est lui qui réserve ton lit.",
            action: !session.login && (
                <Link to="/register" className={btnClass("secondary", "sm")}>
                    M’inscrire
                </Link>
            ),
        },
        {
            key: "login",
            done: !!session.login,
            title: "Vérifier que je peux me connecter",
            text: session.login
                ? "Connecté en tant que " + session.login + ", tout est en ordre."
                : "Teste ton mot de passe en amont, pas le jour J.",
            action: !session.login && (
                <Button variant="primary" size="sm" icon="login" onClick={openLogin}>
                    Connexion
                </Button>
            ),
        },
        {
            key: "guide",
            done: false,
            title: "Lire le guide du shotgun",
            text: "Le guide devrait vous aider à vous préparer.",
            action: (
                <a
                    href={SHOTGUN_GUIDE_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className={btnClass("ghost", "sm")}
                >
                    Le guide <Icon name="external" size={16} />
                </a>
            ),
        },
        {
            key: "whatsapp",
            done: false,
            title: "Rejoindre le groupe WhatsApp",
            text: "Pour être notifié directement au moment du Shotgun et au courant de toutes les actualités.",
        },
    ];

    return (
        <ol className="preflight" aria-label="Avant le shotgun">
            {steps.map((step, index) => (
                <li key={step.key} className={"preflight__step" + (step.done ? " is-done" : "")}>
                    <span className="preflight__num" aria-hidden="true">
                        {step.done ? <Icon name="check" size={18} strokeWidth={2.6} /> : index + 1}
                    </span>
                    <div className="preflight__text">
                        <strong>
                            {step.title}
                            {step.done && <span className="visually-hidden"> (fait)</span>}
                        </strong>
                        <span>{step.text}</span>
                    </div>
                    {step.action ? <div className="preflight__action">{step.action}</div> : null}
                </li>
            ))}
        </ol>
    );
};

const TeaserPanel = ({ edition, session, status }) => (
    <Ticket kicker="Prochain départ" title="Le shotgun des chambres">
        {edition ? (
            <>
                <p className="ticket__when">
                    Ouverture le <b>{formatDayTime(edition.shotgunDate)}</b>
                </p>
                <LiveCountdown target={edition.shotgunDate} />
            </>
        ) : status === "loading" ? (
            <p className="muted">Consultation des horaires de marée…</p>
        ) : session.login ? (
            <Notice kind="info">
                La date de shotgun n'a pas encore été définie cette année. Reviens plus tard !
            </Notice>
        ) : (
            <p className="ticket__when">
                Le compte à rebours du shotgun s’affiche ici{" "}
                <button type="button" className="linklike" onClick={openLogin}>
                    une fois connecté
                </button>
                .
            </p>
        )}
        <h3 className="ticket__subtitle">Check-list d’avant départ</h3>
        <Preflight session={session} />
        <p className="ticket__foot">
            <b>Organisez-vous pour le shotgun !</b>
        </p>
    </Ticket>
);

const ShotgunPanel = ({ edition, session, now }) => {
    const opened = now >= new Date(edition.shotgunDate).getTime();

    return (
        <Ticket
            kicker={opened ? "Embarquement immédiat" : "Dernier appel"}
            title={opened ? "Le shotgun est ouvert !" : "Le shotgun ouvre dans"}
            tone="hot"
        >
            {opened ? (
                <p className="ticket__when">
                    Ouvert depuis le {formatDayTime(edition.shotgunDate)}. Les meilleurs hamacs
                    partent vite !
                </p>
            ) : (
                <LiveCountdown target={edition.shotgunDate} size="xl" />
            )}
            {session.ready && !session.login && (
                <Notice kind="warning" title="Pas encore connecté ?">
                    Le shotgun n’est accessible qu’une fois connecté.{" "}
                    <button type="button" className="linklike" onClick={openLogin}>
                        Connecte-toi maintenant
                    </button>{" "}
                    pour ne pas perdre de temps.
                </Notice>
            )}
            <div className="ticket__cta">
                <Link
                    to="/shotgun"
                    className={btnClass("accent", "xl", opened ? "btn--pulse" : "")}
                >
                    <Icon name="bed" />
                    {opened ? "Shotgun ma chambre" : "Aller sur la page shotgun"}
                </Link>
            </div>
        </Ticket>
    );
};

const Tiles = ({ items }) => (
    <ul className="tiles">
        {items.map((item) => (
            <li key={item.to}>
                <Link to={item.to} className={"tile" + (item.featured ? " tile--featured" : "")}>
                    <span className="tile__icon" aria-hidden="true">
                        <Icon name={item.icon} size={26} />
                    </span>
                    <span className="tile__text">
                        <strong>{item.title}</strong>
                        <span>{item.text}</span>
                    </span>
                    <Icon name="arrow" size={18} className="tile__arrow" />
                </Link>
            </li>
        ))}
    </ul>
);

const CountdownPanel = ({ edition }) => (
    <Ticket kicker="Prochain arrêt : Houlgate" title="Plus que quelques dodos">
        <p className="ticket__when">
            Rendez-vous le <b>{formatDay(edition.weekendDate)}</b> à la Villa Les Genêts.
        </p>
        <LiveCountdown target={edition.weekendDate} light />
        <Tiles
            items={[
                {
                    to: "/trips",
                    icon: "car",
                    title: "Trajets",
                    text: "Débusque un trajet en voiture, ou propose le tien.",
                    featured: true,
                },
                {
                    to: "/checklist",
                    icon: "checklist",
                    title: "Checklist",
                    text: "Draps, matelas, déguisement : rien d’oublié ?",
                },
                {
                    to: "/shotgun",
                    icon: "bed",
                    title: "Les chambres",
                    text: "Qui dort avec qui ? Tout est sur la page shotgun.",
                },
            ]}
        />
    </Ticket>
);

const LivePanel = ({ edition, now }) => {
    const day = weekendDayIndex(edition.weekendDate, now);

    return (
        <Ticket
            kicker={"Jour " + (day + 1) + " · " + formatDay(now)}
            title="C’est le week-end !"
            tone="hot"
        >
            <p className="ticket__when">
                Houlgate est à nous. Suivez les scores en direct et que les meilleurs gagnent !
            </p>
            <Tiles
                items={[
                    {
                        to: "/scores",
                        icon: "trophy",
                        title: "Tableau des scores",
                        text: "Le classement, en direct de la villa.",
                        featured: true,
                    },
                    {
                        to: "/trips",
                        icon: "car",
                        title: "Trajets",
                        text: "Pour organiser le retour (déjà ?).",
                    },
                    {
                        to: "/checklist",
                        icon: "checklist",
                        title: "Checklist",
                        text: "Au cas où il manquerait un drap.",
                    },
                ]}
            />
        </Ticket>
    );
};

const RecapPanel = ({ theme }) => (
    <Ticket kicker="Fin du voyage" title="Merci d’être venus !">
        <p className="ticket__when">
            L’édition {theme.year} rejoint les annales. Merci à toutes et à tous d’avoir fait vibrer
            la Villa Les Genêts, on se retrouve vite pour la prochaine !
        </p>
        <Tiles
            items={[
                {
                    to: "/history",
                    icon: "history",
                    title: "Gloryhoul of Fame",
                    text: "Revivre toutes les éditions, affiches et photos.",
                    featured: true,
                },
                {
                    to: "/scores",
                    icon: "trophy",
                    title: "Les scores",
                    text: "Le classement final, pour l’éternité.",
                },
            ]}
        />
    </Ticket>
);

/* ---------- The edition's pitch ---------- */

const EditionStory = ({ theme, showNotes }) => {
    const hasIntro = theme.intro.length > 0;
    if (!hasIntro && !(showNotes && theme.notes.length)) return null;

    return (
        <section className="story" aria-labelledby="story-title">
            <div className="story__text">
                <span className="kicker">Le thème {theme.year}</span>
                <h2 id="story-title">{theme.subtitle || theme.name}</h2>
                {theme.intro.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? "lead" : ""}>
                        {paragraph}
                    </p>
                ))}
                {showNotes &&
                    theme.notes.map((paragraph, index) => (
                        <p key={"note" + index} className="story__note">
                            {paragraph}
                        </p>
                    ))}
                {theme.signature && <p className="story__signature">{theme.signature}</p>}
            </div>
            {theme.illustrations.length > 0 && (
                <div className="story__gallery">
                    {theme.illustrations.map((illustration, index) => (
                        <figure key={illustration.src} className={"polaroid polaroid--" + index}>
                            <img src={illustration.src} alt="" loading="lazy" />
                            <figcaption>{illustration.caption}</figcaption>
                        </figure>
                    ))}
                </div>
            )}
        </section>
    );
};

const PreviewBar = ({ phase }) => (
    <nav className="preview-bar" aria-label="Aperçu des phases">
        <span className="preview-bar__label">
            <Icon name="sparkle" size={16} /> Aperçu
        </span>
        {PHASES.map((key) => (
            <Link
                key={key}
                to={"/?phase=" + key}
                className={"preview-bar__link" + (key === phase ? " is-active" : "")}
                aria-current={key === phase ? "page" : undefined}
            >
                {PHASE_LABELS[key]}
            </Link>
        ))}
        <Link to="/" className="preview-bar__link preview-bar__exit">
            Quitter
        </Link>
    </nav>
);

const Homepage = () => {
    const { status, edition, theme, phase, now, isPreview } = useEditionTheme();
    const session = useSession();

    let panel;
    if (phase === "shotgun") panel = <ShotgunPanel edition={edition} session={session} now={now} />;
    else if (phase === "countdown") panel = <CountdownPanel edition={edition} />;
    else if (phase === "live") panel = <LivePanel edition={edition} now={now} />;
    else if (phase === "recap") panel = <RecapPanel theme={theme} />;
    else panel = <TeaserPanel edition={edition} session={session} status={status} />;

    return (
        <div className={"WelcomePage home home--" + phase}>
            {isPreview && <PreviewBar phase={phase} />}
            <PosterHero theme={theme} edition={edition} />
            <div className="home__body">
                {panel}
                {(phase === "teaser" || phase === "countdown") && (
                    <EditionStory theme={theme} showNotes={phase === "teaser"} />
                )}
                <section className="home__links" aria-labelledby="links-title">
                    <h2 id="links-title" className="home__links-title">
                        Les escales du site
                    </h2>
                    <p className="muted">
                        Sur ce site vous êtes à bonne adresse si vous voulez{" "}
                        <Link to="/shotgun">shotgun votre chambre</Link>, débusquer{" "}
                        <Link to="/trips">un trajet en voiture</Link> ou suivre en direct le{" "}
                        <Link to="/scores">tableau des scores</Link>. Et pour la nostalgie, le{" "}
                        <Link to="/history">Gloryhoul of Fame</Link> vous attend.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Homepage;
