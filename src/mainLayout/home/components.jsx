import React from "react";
import { Link } from "react-router-dom";

import { AvatarStack, CountdownTiles, Spinner } from "../../ui";
import { openLoginDialog } from "../../login/loginDialog";
import { SHOTGUN_GUIDE_LINK } from "../../editions/themes";
import { PHASES, PHASE_LABELS, getTimeLeft } from "../../editions/phase";

const Emoji = ({ children }) => (
    <span className="emoji" aria-hidden="true">
        {children}
    </span>
);

/* -------------------------------------------------------------------- The invite card */

// The hero of the homepage: the edition's poster and a card with whatever the phase needs
export const InviteCard = ({ theme, kicker, title, subtitle, details, children }) => (
    <section className="invite" aria-labelledby="invite-title">
        <div className="invite__art" aria-hidden="true">
            <span className="invite__float invite__float--1 emoji">✨</span>
            <span className="invite__float invite__float--2 emoji">{theme.emoji}</span>
            <span className="invite__float invite__float--3 emoji">🎈</span>
            {theme.banner ? (
                <img className="invite__poster" src={theme.banner} alt="" />
            ) : (
                <div className="invite__poster invite__poster--blank">
                    <span className="emoji">{theme.emoji}</span>
                    <span>{theme.year}</span>
                </div>
            )}
            {theme.sticker && (
                <span className="sticker sticker--yellow invite__sticker">{theme.sticker}</span>
            )}
        </div>
        <div className="invite__body">
            {kicker && <p className="invite__kicker">{kicker}</p>}
            <h1 className="invite__title" id="invite-title">
                {title}
            </h1>
            {subtitle && <p className="invite__subtitle">{subtitle}</p>}
            {details && details.length > 0 && (
                <ul className="invite__details">
                    {details.map(([emoji, text]) => (
                        <li key={emoji}>
                            <Emoji>{emoji}</Emoji>
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
            )}
            {children}
        </div>
    </section>
);

/* -------------------------------------------------------------------- Countdowns */

export const HomeCountdown = ({ label, target, now, loading, unknown }) => {
    if (loading)
        return (
            <div className="home-countdown">
                <p className="home-countdown__label">
                    <Spinner /> On consulte le calendrier...
                </p>
            </div>
        );

    if (unknown) return <div className="home-countdown">{unknown}</div>;

    return (
        <div className="home-countdown">
            <p className="home-countdown__label">{label}</p>
            <CountdownTiles timeLeft={getTimeLeft(target, now)} label={label} />
        </div>
    );
};

/* -------------------------------------------------------------------- Pre-flight checklist */

const Step = ({ done, emoji, title, children }) => (
    <li className={"preflight__step" + (done ? " is-done" : "")}>
        <span className="preflight__check" aria-hidden="true">
            {done ? "✓" : emoji}
        </span>
        <div className="preflight__text">
            <div className="preflight__title">
                {title}
                {done && <span className="visually-hidden"> (fait)</span>}
            </div>
            {children}
        </div>
    </li>
);

export const Preflight = ({ login, knownAccount, stayTuned, shotgunLabel }) => {
    const hasAccount = !!login || knownAccount;
    const done = (hasAccount ? 1 : 0) + (login ? 1 : 0);

    return (
        <section className="card preflight" aria-labelledby="preflight-title">
            <div className="preflight__head">
                <h2 className="card__title" id="preflight-title">
                    <Emoji>🧳</Emoji> Ta check-list pré-shotgun
                </h2>
                <span className={"sticker " + (done === 2 ? "sticker--mint" : "sticker--pink")}>
                    {done}/2 {done === 2 ? "prêt·e !" : "en cours"}
                </span>
            </div>
            <p className="muted">
                D'ici là pensez à vous inscrire et vérifiez bien que vous pouvez vous connecter en
                amont. <b>Organisez-vous pour le shotgun !</b>
            </p>
            <ol className="preflight__steps">
                <Step done={hasAccount} emoji="✍️" title="Créer mon compte">
                    {!hasAccount && (
                        <Link to="/register" className="btn btn--sm btn--primary">
                            Je m'inscris
                        </Link>
                    )}
                </Step>
                <Step
                    done={!!login}
                    emoji="🔑"
                    title={
                        login
                            ? "Connecté·e en tant que " + login
                            : "Vérifier que je peux me connecter"
                    }
                >
                    {!login && (
                        <button type="button" className="btn btn--sm" onClick={openLoginDialog}>
                            Je me connecte
                        </button>
                    )}
                </Step>
                <Step emoji="📖" title="Lire le guide du shotgun">
                    <span className="small muted">
                        Le{" "}
                        <a target="_blank" rel="noreferrer" href={SHOTGUN_GUIDE_LINK}>
                            guide
                        </a>{" "}
                        devrait vous aider à vous préparer.
                    </span>
                </Step>
                <Step emoji="💬" title="Rester informé·e">
                    {stayTuned && <span className="small muted">{stayTuned}</span>}
                </Step>
            </ol>
            {done === 2 && shotgunLabel && (
                <p className="preflight__ready">
                    <Emoji>🏁</Emoji> Tout est prêt : rendez-vous {shotgunLabel} !
                </p>
            )}
        </section>
    );
};

/* -------------------------------------------------------------------- Quick links */

export const QuickLinks = ({ links }) => (
    <nav className="quick-links" aria-label="Raccourcis">
        {links.map((link, index) => (
            <Link
                key={link.to}
                to={link.to}
                className={"quick-link" + (link.big ? " quick-link--big" : "")}
                style={{ "--tilt": (index % 2 ? 1.5 : -1.5) + "deg" }}
            >
                <span className="quick-link__emoji emoji" aria-hidden="true">
                    {link.emoji}
                </span>
                <span className="quick-link__title">{link.title}</span>
                {link.text && <span className="quick-link__text">{link.text}</span>}
            </Link>
        ))}
    </nav>
);

/* -------------------------------------------------------------------- Who's coming */

export const WhoIsComing = ({ people }) => {
    if (!people || !people.length) return null;

    return (
        <section className="card card--soft who" aria-labelledby="who-title">
            <h2 className="card__title" id="who-title">
                <Emoji>🛌</Emoji> Ils ont déjà leur lit
            </h2>
            <p className="muted">
                {people.length} {people.length > 1 ? "personnes ont" : "personne a"} déjà sa place à
                la villa.
            </p>
            <AvatarStack names={people} max={18} />
        </section>
    );
};

/* -------------------------------------------------------------------- Edition story */

export const EditionStory = ({ theme, withLogistics }) => {
    if (!theme.intro.length && !theme.images.length) return null;
    const [firstImage, secondImage, thirdImage] = theme.images;

    return (
        <section className="story" aria-labelledby="story-title">
            <h2 id="story-title" className="story__title">
                <Emoji>💌</Emoji> {theme.tagline || theme.name}
            </h2>
            {theme.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
            ))}
            {theme.question && <p className="story__question">{theme.question}</p>}
            {firstImage && <Polaroid image={firstImage} tilt={-2} />}
            {withLogistics && theme.bedNote && <p>{theme.bedNote}</p>}
            {theme.latecomers && <p>{theme.latecomers}</p>}
            {secondImage && <Polaroid image={secondImage} tilt={2} />}
            {thirdImage && <Polaroid image={thirdImage} tilt={-1} wide />}
            {theme.signature && <p className="story__signature">{theme.signature}</p>}
        </section>
    );
};

const Polaroid = ({ image, tilt, wide }) => (
    <figure
        className={"polaroid" + (wide ? " polaroid--wide" : "")}
        style={{ "--tilt": tilt + "deg" }}
    >
        <img src={image.src} alt={image.caption} loading="lazy" />
        <figcaption>{image.caption}</figcaption>
    </figure>
);

/* -------------------------------------------------------------------- Preview switcher */

// Shown with ?phase=..., to go through the phases without any backend
export const PreviewBar = ({ phase, search }) => {
    const linkTo = (other) => {
        const params = new URLSearchParams(search);
        params.set("phase", other);
        return "/?" + params.toString();
    };

    return (
        <div className="preview-bar" role="note">
            <span className="preview-bar__label">
                <Emoji>👀</Emoji> Aperçu
            </span>
            {PHASES.map((other) => (
                <Link
                    key={other}
                    to={linkTo(other)}
                    className={"preview-bar__phase" + (other === phase ? " is-active" : "")}
                    aria-current={other === phase ? "page" : undefined}
                    title={PHASE_LABELS[other]}
                >
                    {other}
                </Link>
            ))}
            <Link to="/" className="preview-bar__phase preview-bar__exit" title="Quitter l'aperçu">
                ✕
            </Link>
        </div>
    );
};
