import React, { useEffect, useState } from "react";

import { currentEdition as edition } from "../content/currentEdition";
import { photos } from "../content/photos";
import { USERS_ENDPOINT } from "../constants";
import { getCallApi } from "../utils/api/fetchMiddleware";
import { getCredentials, register, unregister } from "../login/store";
import { openLoginDialog } from "../login/loginDialog";
import { formatDayAndTime, formatRange, formatTimeLeft } from "../utils/dates";
import { Button, Card, EditionBadge, Icon, Photo, PhotoViewer, Reveal, Shape, Shapes } from "../ui";
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

// The time left before the shotgun, in its last 7 days, updated every minute
const useTimeLeft = (date) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    return new Date(date) - now < WEEK ? formatTimeLeft(date, now) : null;
};

// The one main action: sign up, then go to the shotgun, then see your bed
const MainAction = () => {
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

    return (
        <div className="hero__actions">
            <Button to="/shotgun" icon="bed" className="md-button--large">
                {hasBed ? "Voir mon lit" : "Aller au shotgun"}
            </Button>
        </div>
    );
};

// The homepage is a keynote: one idea per section, each sliding in like the next slide
const Homepage = () => {
    const timeLeft = useTimeLeft(edition.shotgunDate);
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
                        Houlgate · {formatRange(edition.startDate, edition.endDate).toLowerCase()}
                    </p>
                    <h1 id="edition-name" className="stage-headline hero__title">
                        {edition.name}
                    </h1>
                    <p className="stage-lead hero__lead">{edition.theme}.</p>
                    <MainAction />
                </div>
                {/* The sun setting on the sea of Houlgate, the logo's motif, with a sail */}
                <div className="hero__art">
                    <Shapes
                        shapes={[
                            ["half", "yellow"],
                            ["bar", "blue"],
                            ["bar", "blue"],
                            ["triangle", "red"],
                            ["circle", "green"],
                        ]}
                    />
                </div>
            </section>

            <Reveal className="slide hero-photo" aria-label="Le weekend en photo">
                <Photo
                    id={edition.heroPhoto}
                    priority
                    sizes="(min-width: 1100px) 1040px, 100vw"
                    className="stage-photo"
                />
                <EditionBadge
                    year={edition.year}
                    size="large"
                    label={"Édition " + edition.year}
                    className="hero-photo__badge"
                />
            </Reveal>

            <Reveal className="slide statement accent-green" aria-labelledby="shotgun-date">
                <Shapes
                    className="statement__shapes"
                    shapes={[
                        ["arc", "blue"],
                        ["circle", "green"],
                    ]}
                />
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
                <p className="stage-lead statement__lead">
                    Seul votre lit est à réserver sur ce site : vérifiez dès maintenant que vous
                    arrivez à vous connecter.
                </p>
            </Reveal>

            <Reveal className="slide word accent-yellow" aria-label="Le mot des orgas">
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

            <Reveal className="slide past accent-red" aria-labelledby="past-title">
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
                <Card className="practical__card accent-blue">
                    <Shape kind="circle" color="blue" className="practical__shape" />
                    <h2 className="stage-subtitle">Restez informés</h2>
                    <p className="body-large on-surface-variant">{edition.whatsApp}</p>
                </Card>
                <Card className="practical__card accent-yellow">
                    <Shape kind="triangle" color="yellow" className="practical__shape" />
                    <h2 className="stage-subtitle">Le guide du shotgun</h2>
                    <p className="body-large on-surface-variant">
                        Il devrait vous aider à vous préparer. Organisez-vous pour le shotgun !
                    </p>
                    <Button variant="tonal" href={edition.shotgunGuideUrl} trailingIcon="openInNew">
                        Lire le guide
                    </Button>
                </Card>
            </Reveal>
        </div>
    );
};

export default Homepage;
