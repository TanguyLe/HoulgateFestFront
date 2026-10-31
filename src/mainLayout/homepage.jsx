import React from "react";
import { Link } from "react-router-dom";

import withRouter from "../utils/withRouter";
import Countdown from "../shotgun/components/countdown";
import { getCredentials, register, unregister } from "../login/store";
import { openLoginPanel } from "../login/loginPanel";
import { getEditionState, getEditionTheme, subscribeEdition } from "../editions/editionStore";
import {
    PHASES,
    computePhase,
    daysBetween,
    formatDay,
    formatHour,
    formatShortDate,
    getPreviewEdition,
    getPreviewPhase,
    getWeekendEnd,
} from "../editions/phase";
import { Marquee, cx } from "../ui";
import Icon from "../ui/icons";

const SHOTGUN_GUIDE_LINK =
    "https://docs.google.com/document/d/19Yfhg8whi_AQRPlVCqYRUmmdQwRggpVxn1tbaPKCMkc/edit?usp=sharing";

const PHASE_LABELS = {
    teaser: "Avant le shotgun",
    shotgun: "Shotgun",
    countdown: "Avant le weekend",
    live: "Le weekend",
    recap: "Après",
};

const LINEUP = {
    shotgun: { to: "/shotgun", title: "Shotgun", text: "Shotgun votre chambre" },
    trips: { to: "/trips", title: "Trajets", text: "Débusquer un trajet en voiture" },
    scores: { to: "/scores", title: "Scores", text: "Suivre en direct le tableau des scores" },
    checklist: { to: "/checklist", title: "Checklist", text: "Rien oublier avant de partir" },
    history: { to: "/history", title: "Gloryhoul of Fame", text: "Toutes les éditions passées" },
    contact: { to: "/contact", title: "Contact", text: "Écrire aux orgas" },
};

const LINEUP_ORDER = {
    teaser: ["shotgun", "trips", "checklist", "history", "contact"],
    shotgun: ["shotgun", "checklist", "trips", "history"],
    countdown: ["trips", "checklist", "shotgun", "history"],
    live: ["scores", "trips", "checklist", "shotgun"],
    recap: ["history", "scores", "contact"],
};

const Lineup = ({ keys }) => (
    <nav className="lineup" aria-label="Sur ce site">
        <h2 className="label lineup__head">Sur ce site</h2>
        <ol className="lineup__list">
            {keys.map((key, index) => {
                const item = LINEUP[key];
                return (
                    <li key={key}>
                        <Link to={item.to} className="lineup__row">
                            <span className="lineup__num">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="lineup__title">{item.title}</span>
                            <span className="lineup__text">{item.text}</span>
                            <Icon name="arrow" className="lineup__arrow" />
                        </Link>
                    </li>
                );
            })}
        </ol>
    </nav>
);

const Hero = ({ theme, edition }) => {
    const dates = edition
        ? "Du " +
          formatShortDate(edition.weekendDate) +
          " au " +
          formatShortDate(getWeekendEnd(edition))
        : theme.when;

    return (
        <section className="hero">
            <div className="hero__meta">
                <span className="label">Édition {theme.year}</span>
                <span className="label">Villa Les Genêts — Houlgate</span>
                {dates && <span className="label">{dates}</span>}
            </div>
            <div className="hero__body">
                <h1 className="hero__title">
                    <span className="visually-hidden">{theme.name} — </span>
                    {theme.posterLines.map((line, index) => (
                        <span className="hero__line" key={index} aria-hidden="true">
                            {line}
                        </span>
                    ))}
                </h1>
                {theme.banner && (
                    <img
                        className="hero__poster"
                        src={theme.banner}
                        alt={"Affiche " + theme.name}
                        width="420"
                        height="420"
                    />
                )}
            </div>
            <p className="hero__tagline">{theme.tagline}</p>
        </section>
    );
};

// Theme texts of the edition (src/editions/themes.js)
const ThemeStory = ({ theme, edition, phase }) => {
    const home = theme.home || {};
    const showBed = phase === "teaser" || phase === "shotgun";

    return (
        <section className="story">
            <div className="story__head">
                <p className="label">Le thème</p>
                <h2 className="story__title">{home.headline || theme.name}</h2>
            </div>
            <div className="story__body prose">
                {(home.intro || []).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
                {showBed && home.bed && <p>{home.bed}</p>}
                {showBed && edition && (
                    <p className="story__callout">
                        Soyez présents le {formatDay(edition.shotgunDate)} à{" "}
                        {formatHour(edition.shotgunDate)} sur cette plateforme pour choisir votre
                        meilleur hamac !
                    </p>
                )}
                {(home.extra || []).map((paragraph) => (
                    <p key={paragraph}>
                        {paragraph}{" "}
                        {home.hashtag && <span className="hashtag">{home.hashtag}</span>}
                    </p>
                ))}
                {home.news && <p className="story__news">{home.news}</p>}
                {home.signature && <p className="story__signature">{home.signature}</p>}
            </div>
            {home.gallery && (
                <ul className="gallery">
                    {home.gallery.map((image) => (
                        <li key={image.src} className="gallery__item">
                            <figure>
                                <img src={image.src} alt={image.caption} loading="lazy" />
                                <figcaption className="label">{image.caption}</figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

const Preflight = ({ loggedIn }) => {
    const steps = [
        {
            done: loggedIn,
            title: "Compte créé",
            text: "Pensez à vous inscrire bien avant le jour J.",
            cta: (
                <Link to="/register" className="btn btn--small">
                    Je m'inscris
                </Link>
            ),
        },
        {
            done: loggedIn,
            title: "Connexion testée",
            text: "Vérifiez bien que vous pouvez vous connecter en amont.",
            cta: (
                <button
                    type="button"
                    className="btn btn--small btn--primary"
                    onClick={openLoginPanel}
                >
                    Je me connecte
                </button>
            ),
        },
        {
            done: null,
            title: "Guide lu",
            text: "Le guide devrait vous aider à vous préparer.",
            cta: (
                <a
                    className="btn btn--small"
                    href={SHOTGUN_GUIDE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Lire le guide
                </a>
            ),
        },
    ];

    return (
        <section className="preflight">
            <div className="preflight__head">
                <p className="label">Check pré-shotgun</p>
                <h2 className="preflight__title">Organisez-vous pour le shotgun&nbsp;!</h2>
            </div>
            <ol className="preflight__list">
                {steps.map((step, index) => (
                    <li
                        key={step.title}
                        className={cx("preflight__step", step.done && "preflight__step--done")}
                    >
                        <span className="preflight__mark" aria-hidden="true">
                            {step.done ? "✓" : index + 1}
                        </span>
                        <div className="preflight__text">
                            <strong>
                                {step.title}
                                {step.done && <span className="visually-hidden"> : fait</span>}
                            </strong>
                            <span>{step.text}</span>
                        </div>
                        {!step.done && <div className="preflight__cta">{step.cta}</div>}
                    </li>
                ))}
            </ol>
        </section>
    );
};

const LoginNudge = () => (
    <p className="phase__nudge">
        <button type="button" className="linkish" onClick={openLoginPanel}>
            Connecte-toi
        </button>{" "}
        pour voir les dates et le compte à rebours de l'édition.
    </p>
);

class Homepage extends React.Component {
    constructor() {
        super();

        this.state = {
            edition: getEditionState(),
            login: getCredentials().login,
            // bumped when a countdown ends, to compute the phase again
            tick: 0,
        };

        this.onEdition = this.onEdition.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onTime = this.onTime.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = subscribeEdition(this.onEdition);
        register(this.onLogin);
        // the phase may change while the page stays open
        this.interval = setInterval(this.onTime, 60 * 1000);
    }

    componentWillUnmount() {
        this.unsubscribe();
        unregister(this.onLogin);
        clearInterval(this.interval);
    }

    onEdition(edition) {
        this.setState({ edition: edition });
    }

    onLogin(creds) {
        this.setState({ login: creds.login });
    }

    onTime() {
        this.setState({ tick: this.state.tick + 1 });
    }

    renderCountdown(target, now, label, small) {
        if (target <= now) return null;
        return (
            <Countdown
                key={target + "-" + this.state.tick}
                targetDatetime={new Date(target)}
                currentDatetime={new Date(now)}
                onTime={this.onTime}
                label={label}
                small={small}
            />
        );
    }

    renderPhase(phase, edition, theme, now, loggedIn) {
        const shotgun = edition ? new Date(edition.shotgunDate).getTime() : null;
        const weekend = edition ? new Date(edition.weekendDate).getTime() : null;

        switch (phase) {
            case "teaser":
                return (
                    <>
                        <section className="phase phase--teaser">
                            <div className="phase__intro">
                                <p className="label">Ouverture du shotgun des chambres</p>
                                {edition ? (
                                    <h2 className="phase__title">
                                        {formatDay(edition.shotgunDate)}{" "}
                                        <span className="phase__accent">
                                            {formatHour(edition.shotgunDate)}
                                        </span>
                                    </h2>
                                ) : (
                                    <h2 className="phase__title">Bientôt</h2>
                                )}
                            </div>
                            {edition
                                ? this.renderCountdown(shotgun, now, "Temps avant le shotgun")
                                : !loggedIn && <LoginNudge />}
                        </section>
                        <Preflight loggedIn={loggedIn} />
                    </>
                );
            case "shotgun": {
                const open = now >= shotgun;
                return (
                    <section className="phase phase--shotgun">
                        <p className="label">Shotgun des chambres</p>
                        <h2 className="phase__mega">
                            {open ? "C'est ouvert !" : "C'est l'heure !"}
                        </h2>
                        {!open &&
                            this.renderCountdown(shotgun, now, "Temps avant le shotgun", true)}
                        <div className="phase__cta">
                            <Link to="/shotgun" className="btn btn--huge btn--primary">
                                Shotgun ma chambre
                                <Icon name="arrow" size={32} />
                            </Link>
                            {!loggedIn && (
                                <button
                                    type="button"
                                    className="btn btn--huge"
                                    onClick={openLoginPanel}
                                >
                                    Me connecter d'abord
                                </button>
                            )}
                        </div>
                        <p className="phase__note">
                            Seul votre lit est à réserver sur ce site ! Les moins réactifs pourront
                            toujours apporter leurs plus belles toiles de tente.
                        </p>
                    </section>
                );
            }
            case "countdown": {
                const days = daysBetween(now, weekend);
                return (
                    <section className="phase phase--countdown">
                        <div className="phase__split">
                            <div>
                                <p className="label">Le shotgun est plié, prochain arrêt</p>
                                <h2 className="phase__title">Houlgate</h2>
                                <p className="phase__sub">{formatDay(edition.weekendDate)}</p>
                            </div>
                            <p className="phase__jday" aria-label={"J moins " + days}>
                                J-{days}
                            </p>
                        </div>
                        {this.renderCountdown(weekend, now, "Temps avant le weekend", true)}
                        <div className="phase__cards">
                            <Link to="/trips" className="card-link">
                                <Icon name="car" size={32} />
                                <strong>Trajets</strong>
                                <span>Débusquer un trajet en voiture</span>
                            </Link>
                            <Link to="/checklist" className="card-link">
                                <Icon name="check" size={32} />
                                <strong>Checklist</strong>
                                <span>Draps, matelas, déguisement…</span>
                            </Link>
                            <Link to="/shotgun" className="card-link">
                                <Icon name="bed" size={32} />
                                <strong>Qui dort où</strong>
                                <span>Les chambres shotgun</span>
                            </Link>
                        </div>
                    </section>
                );
            }
            case "live": {
                const day = Math.min(3, Math.max(1, daysBetween(weekend, now)));
                return (
                    <section className="phase phase--live">
                        <p className="label">
                            <span className="live-dot" aria-hidden="true" /> En direct de Houlgate
                        </p>
                        <h2 className="phase__mega">C'est maintenant !</h2>
                        <p className="phase__sub">
                            Aujourd'hui : {formatDay(now)} — jour {day}/3
                        </p>
                        <div className="phase__cards">
                            <Link to="/scores" className="card-link card-link--hot">
                                <Icon name="trophy" size={32} />
                                <strong>Scores</strong>
                                <span>Suivre en direct le tableau des scores</span>
                            </Link>
                            <Link to="/trips" className="card-link">
                                <Icon name="car" size={32} />
                                <strong>Trajets</strong>
                                <span>Pour le retour aussi</span>
                            </Link>
                            <Link to="/checklist" className="card-link">
                                <Icon name="check" size={32} />
                                <strong>Checklist</strong>
                                <span>Au cas où</span>
                            </Link>
                        </div>
                    </section>
                );
            }
            case "recap":
            default:
                return (
                    <section className="phase phase--recap">
                        <p className="label">C'est fini (pour cette année)</p>
                        <h2 className="phase__mega">Merci !</h2>
                        <p className="phase__sub">
                            {theme.name} est déjà dans les annales. Les survivants peuvent aller se
                            recoucher.
                        </p>
                        <div className="phase__cta">
                            <Link to="/history" className="btn btn--huge btn--primary">
                                Gloryhoul of Fame
                                <Icon name="arrow" size={32} />
                            </Link>
                        </div>
                    </section>
                );
        }
    }

    getTicker(phase, edition, theme) {
        const base = [theme.name, theme.tagline];
        if (!edition) return base.concat(["Houlgate", "Shotgun bientôt"]);

        const shotgun =
            formatShortDate(edition.shotgunDate) + " " + formatHour(edition.shotgunDate);
        return {
            teaser: ["Shotgun le " + shotgun].concat(base),
            shotgun: ["Shotgun", "Shotgun", "Shotgun", "Shotgun"],
            countdown: ["Rendez-vous le " + formatShortDate(edition.weekendDate)].concat(base),
            live: ["En direct", "Houlgate", theme.name, "En direct"],
            recap: ["Merci", theme.name, "À l'année prochaine"],
        }[phase];
    }

    render() {
        const { edition: editionState, login } = this.state;
        const loggedIn = !!login;
        const realEdition = editionState.edition;
        const theme = getEditionTheme(realEdition);
        const now = Date.now() + editionState.clockOffset;

        const preview = getPreviewPhase(this.props.location.search);
        const realPhase = computePhase(realEdition, now);
        const phase = preview || realPhase;
        const edition =
            preview && (!realEdition || realPhase !== preview)
                ? getPreviewEdition(preview, theme.year, now)
                : realEdition;
        const loading = !preview && editionState.status === "loading";

        return (
            <div className={"home home--" + phase}>
                {preview && (
                    <nav className="preview-bar" aria-label="Aperçu des phases">
                        <span className="label">Aperçu</span>
                        {PHASES.map((key) => (
                            <Link
                                key={key}
                                to={"/?phase=" + key}
                                className={cx("preview-bar__link", key === phase && "active")}
                                aria-current={key === phase ? "page" : undefined}
                            >
                                {PHASE_LABELS[key]}
                            </Link>
                        ))}
                        <Link to="/" className="preview-bar__link">
                            Réel
                        </Link>
                    </nav>
                )}
                <Hero theme={theme} edition={edition} />
                <Marquee
                    items={this.getTicker(phase, edition, theme)}
                    variant={phase === "shotgun" ? "accent" : undefined}
                />
                {loading ? (
                    <section className="phase">
                        <p className="label">Chargement de l'édition…</p>
                    </section>
                ) : (
                    this.renderPhase(phase, edition, theme, now, loggedIn)
                )}
                {phase !== "recap" && <ThemeStory theme={theme} edition={edition} phase={phase} />}
                <Lineup keys={LINEUP_ORDER[phase]} />
            </div>
        );
    }
}

export default withRouter(Homepage);
