import React, { useEffect, useState } from "react";

import { currentEdition as edition } from "../content/currentEdition";
import { photos } from "../content/photos";
import { USERS_ENDPOINT } from "../constants";
import { getCallApi } from "../utils/api/fetchMiddleware";
import { getCredentials, register, unregister } from "../login/store";
import { openLoginDialog } from "../login/loginDialog";
import { formatDayAndTime, formatRange, formatTimeLeft } from "../utils/dates";
import { Button, Icon, Photo, PhotoViewer, Reveal, Shapes } from "../ui";
import "./homepage.css";

const WEEK = 7 * 24 * 60 * 60 * 1000;

// The connected user's login, kept up to date
const useLogin = () => {
    const [login, setLogin] = useState(getCredentials().login);

    useEffect(() => {
        const onChange = (creds) => setLogin(creds.login);
        register(onChange);
        setLogin(getCredentials().login);
        return () => unregister(onChange);
    }, []);

    return login;
};

// Whether the connected user already has a bed (or a pre-shotgun), null while unknown
const useHasBed = (login) => {
    const [hasBed, setHasBed] = useState(null);

    useEffect(() => {
        setHasBed(null);
        if (!login) return;

        let current = true;
        getCallApi(USERS_ENDPOINT, true, false)
            .then((response) => response.json())
            .then((json) => {
                const me = json.data.find((user) => user.username === login);
                if (current) setHasBed(Boolean(me && (me.hasShotgun || me.hasPreShotgun)));
            })
            .catch(() => {});

        return () => {
            current = false;
        };
    }, [login]);

    return hasBed;
};

// The time, updated every minute: the homepage changes as the edition comes and goes
const useNow = () => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    return now;
};

// Where the edition is: before its shotgun, between the shotgun and the end of the weekend, or past
const getPhase = (now) => {
    if (now < new Date(edition.shotgunDate)) return "coming";
    if (now <= new Date(edition.endDate)) return "open";
    return "past";
};

// The one main action: sign up, then go to the shotgun, then see your bed; once the edition is
// past, look back at the editions
const MainAction = ({ phase }) => {
    const login = useLogin();
    const hasBed = useHasBed(login);

    if (!login)
        return (
            <div className="hero__actions">
                <Button to="/register" icon="person" className="md-button--large">
                    Créer un compte
                </Button>
                <Button variant="text" onClick={openLoginDialog} aria-haspopup="dialog">
                    J'ai déjà un compte
                </Button>
            </div>
        );

    if (phase === "past")
        return (
            <div className="hero__actions">
                <Button to="/history" icon="history" className="md-button--large">
                    Revoir les éditions
                </Button>
            </div>
        );

    return (
        <div className="hero__actions">
            <Button to="/shotgun" icon="bed" className="md-button--large">
                {hasBed ? "Voir mon lit" : "Aller au shotgun"}
            </Button>
        </div>
    );
};

// The homepage is a keynote: one idea per section, each sliding in like the next slide. It
// follows the edition: its shotgun date and the organisers' word while it is coming, a look
// back once it is past.
const Homepage = () => {
    const now = useNow();
    const phase = getPhase(now);
    const timeLeft =
        phase === "coming" && new Date(edition.shotgunDate) - now < WEEK
            ? formatTimeLeft(edition.shotgunDate, now)
            : null;
    const dates = formatRange(edition.startDate, edition.endDate).toLowerCase();
    const [viewed, setViewed] = useState(null);
    // The first sentence of the organisers' text is said big, the rest follows
    const [first, ...others] = edition.text;
    const end = first.search(/[.!?…]\s/) + 1;
    const opening = end > 0 ? first.slice(0, end) : first;
    const rest = [first.slice(opening.length).trim(), ...others].filter(Boolean);

    return (
        <div className="keynote">
            <section className="slide hero" aria-labelledby="edition-name">
                <div className="hero__content">
                    <p className="stage-eyebrow">
                        {phase === "past" ? "L’édition " + edition.year : "Houlgate · " + dates}
                    </p>
                    <h1 id="edition-name" className="stage-headline hero__title">
                        {edition.name}
                    </h1>
                    <p className="stage-lead hero__lead">
                        {phase === "past"
                            ? "C’était " + dates + " à Houlgate. " + edition.afterword
                            : edition.theme + "."}
                    </p>
                    <MainAction phase={phase} />
                </div>
                {/* The sun setting on the sea at Houlgate, the logo's motif */}
                <div className="hero__art">
                    <Shapes
                        shapes={[
                            ["half", "yellow"],
                            ["bar", "blue"],
                            ["bar", "blue"],
                        ]}
                    />
                </div>
            </section>

            <Reveal className="slide hero-photo" aria-label="Le weekend en photo">
                {/* Below the first slide: lazy, it doesn't compete with the headline */}
                <Photo
                    id={edition.heroPhoto}
                    sizes="(min-width: 1100px) 1040px, 100vw"
                    className="stage-photo"
                />
            </Reveal>

            {phase === "coming" && (
                <Reveal className="slide statement" aria-labelledby="shotgun-date">
                    <p className="stage-eyebrow">Le shotgun</p>
                    <h2 id="shotgun-date" className="stage-title statement__title">
                        Les lits se réservent le {formatDayAndTime(edition.shotgunDate)}.
                    </h2>
                    {timeLeft && (
                        <p className="statement__countdown" aria-live="polite">
                            <Icon name="schedule" />
                            Ouverture dans {timeLeft}
                        </p>
                    )}
                </Reveal>
            )}

            {phase !== "past" && (
                <Reveal className="slide word" aria-label="Le mot des orgas">
                    <p className="stage-subtitle word__opening">{opening}</p>
                    <div className="word__text">
                        {rest.map((paragraph) => (
                            <p key={paragraph} className="stage-lead">
                                {paragraph}
                            </p>
                        ))}
                        <p className="word__signature title-medium">{edition.signature}</p>
                    </div>
                </Reveal>
            )}

            <Reveal className="slide past" aria-labelledby="past-title">
                <div className="past__header">
                    <h2 id="past-title" className="stage-title">
                        Les éditions passées
                    </h2>
                    <Button variant="tonal" to="/history" trailingIcon="arrowForward">
                        Tout l'historique
                    </Button>
                </div>
                <ul className="past__grid">
                    {edition.photos.map((id, index) => (
                        <li key={id}>
                            <button
                                type="button"
                                className="photo-button"
                                onClick={() => setViewed(index)}
                                aria-label={"Agrandir : " + photos[id].alt}
                            >
                                <Photo id={id} sizes="(min-width: 840px) 520px, 100vw" />
                            </button>
                        </li>
                    ))}
                </ul>
                <PhotoViewer
                    ids={edition.photos}
                    index={viewed}
                    onChange={setViewed}
                    onClose={() => setViewed(null)}
                    label="Photos des éditions passées"
                />
            </Reveal>

            <Reveal className="slide practical" aria-label="Avant le weekend">
                <div className="practical__item">
                    <h2 className="stage-subtitle">Restez informés</h2>
                    <p className="stage-lead">{edition.whatsApp}</p>
                </div>
                <div className="practical__item">
                    <h2 className="stage-subtitle">Le guide du shotgun</h2>
                    <p className="stage-lead">
                        Il devrait vous aider à vous préparer. Organisez-vous pour le shotgun !
                    </p>
                    <Button variant="tonal" href={edition.shotgunGuideUrl} trailingIcon="openInNew">
                        Lire le guide
                    </Button>
                </div>
            </Reveal>
        </div>
    );
};

export default Homepage;
