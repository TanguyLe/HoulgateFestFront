import React, { useEffect, useState } from "react";

import { currentEdition as edition } from "../content/currentEdition";
import { photos } from "../content/photos";
import { USERS_ENDPOINT } from "../constants";
import { getCallApi } from "../utils/api/fetchMiddleware";
import { getCredentials, register, unregister } from "../login/store";
import { openLoginDialog } from "../login/loginDialog";
import { formatDayAndTime, formatRange, formatTimeLeft } from "../utils/dates";
import { Button, Card, EditionBadge, Icon, Photo, PhotoViewer } from "../ui";
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

const Homepage = () => {
    const timeLeft = useTimeLeft(edition.shotgunDate);
    const [viewed, setViewed] = useState(null);

    return (
        <>
            <section className="hero" aria-labelledby="edition-name">
                <div className="hero__media">
                    <Photo
                        id={edition.heroPhoto}
                        priority
                        sizes="(min-width: 840px) 520px, 100vw"
                        className="hero__photo"
                    />
                    <EditionBadge
                        year={edition.year}
                        size="large"
                        label={"Édition " + edition.year}
                        className="hero__badge"
                    />
                </div>
                <div className="hero__content">
                    <h1 id="edition-name" className="display-medium emphasized">
                        {edition.name}
                    </h1>
                    <p className="hero__theme title-large">{edition.theme}</p>
                    <ul className="hero__facts body-large">
                        <li>
                            <Icon name="event" />
                            {formatRange(edition.startDate, edition.endDate)} à Houlgate
                        </li>
                        <li>
                            <Icon name="bed" />
                            Shotgun des lits le {formatDayAndTime(edition.shotgunDate)}
                        </li>
                    </ul>
                    {timeLeft && (
                        <p className="hero__countdown title-medium" aria-live="polite">
                            <Icon name="schedule" />
                            Ouverture dans {timeLeft}
                        </p>
                    )}
                    <MainAction />
                </div>
            </section>

            <section className="home-word" aria-label="Le mot des orgas">
                <div className="prose body-large">
                    {edition.text.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                    <p className="home-word__signature title-medium">{edition.signature}</p>
                </div>
            </section>

            <section className="home-photos" aria-labelledby="home-photos-title">
                <h2 id="home-photos-title" className="headline-small">
                    Les éditions passées
                </h2>
                <ul className="home-photos__grid">
                    {edition.photos.map((id, index) => (
                        <li key={id}>
                            <button
                                type="button"
                                className="photo-button"
                                onClick={() => setViewed(index)}
                                aria-label={"Agrandir : " + photos[id].alt}
                            >
                                <Photo id={id} sizes="(min-width: 840px) 260px, 50vw" />
                            </button>
                        </li>
                    ))}
                </ul>
                <Button variant="text" to="/history" trailingIcon="arrowForward">
                    Tout l'historique
                </Button>
                <PhotoViewer
                    ids={edition.photos}
                    index={viewed}
                    onChange={setViewed}
                    onClose={() => setViewed(null)}
                    label="Photos des éditions passées"
                />
            </section>

            <section className="home-cards" aria-label="Avant le weekend">
                <Card className="home-card">
                    <h2 className="title-large">Restez informés</h2>
                    <p className="body-medium">{edition.whatsApp}</p>
                </Card>
                <Card className="home-card">
                    <h2 className="title-large">Le guide du shotgun</h2>
                    <p className="body-medium">
                        Il devrait vous aider à vous préparer. Organisez-vous pour le shotgun !
                    </p>
                    <Button variant="tonal" href={edition.shotgunGuideUrl} trailingIcon="openInNew">
                        Lire le guide
                    </Button>
                </Card>
            </section>
        </>
    );
};

export default Homepage;
