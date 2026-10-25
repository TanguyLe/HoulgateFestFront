import React from "react";
import { Link } from "react-router-dom";

import Icon from "../ui/icon";
import { CURRENT_EDITION as edition } from "../content/edition";

const Marquee = ({ words }) => {
    // Rendered twice so the CSS translate loop is seamless
    const row = words.map((word) => (
        <span key={word} className="marquee__item">
            {word}
            <span className="marquee__star" aria-hidden>
                ✦
            </span>
        </span>
    ));

    return (
        <div className="marquee" aria-hidden>
            <div className="marquee__track">
                {row}
                {row}
            </div>
        </div>
    );
};

const QUICK_LINKS = [
    {
        to: "/shotgun",
        icon: "bed",
        title: "Shotgun ta chambre",
        text: "Le plan de la villa, en direct. Premier arrivé, premier couché.",
    },
    {
        to: "/trips",
        icon: "car",
        title: "Trouve un trajet",
        text: "Covoiturage vers Houlgate, pour remplir les coffres et les playlists.",
    },
    {
        to: "/scores",
        icon: "trophy",
        title: "Suis les scores",
        text: "Le tableau des duos, mis à jour tout le week-end.",
    },
];

const Homepage = () => (
    <div className="home">
        <section className="hero">
            <div className="hero__inner">
                <div className="hero__copy">
                    <div className="hero__chips">
                        <span className="chip chip--accent">Édition {edition.year}</span>
                        <span className="chip">
                            <Icon name="pin" size={16} />
                            Houlgate, Normandie
                        </span>
                    </div>
                    <h1 className="hero__title">
                        {edition.name.replace(/Fest$/, "")}
                        <em>Fest</em>
                    </h1>
                    <p className="hero__tagline">{edition.tagline}</p>
                    <dl className="hero__facts">
                        <div>
                            <dt>Le week-end</dt>
                            <dd>{edition.dates.label}</dd>
                        </div>
                        <div>
                            <dt>Shotgun des lits</dt>
                            <dd>{edition.shotgun.label}</dd>
                        </div>
                    </dl>
                    <div className="hero__actions">
                        <Link to="/register" className="btn btn--primary btn--lg">
                            Je m'inscris
                            <Icon name="arrowRight" size={18} />
                        </Link>
                        <Link to="/shotgun" className="btn btn--dark btn--lg">
                            Aller au shotgun
                        </Link>
                    </div>
                </div>
                <div className="hero__art">
                    <img
                        className="hero__badge"
                        src={edition.badge}
                        alt={"Badge " + edition.name + " " + edition.year}
                        width="1024"
                        height="1024"
                    />
                </div>
            </div>
        </section>

        <Marquee words={edition.keywords} />

        <section className="home-section home-story">
            <div className="home-story__text">
                <div className="eyebrow">
                    <Icon name="sparkles" size={14} />
                    Le thème · {edition.theme}
                </div>
                <h2>Deux esprits, deux talents, une alliance sans pareille.</h2>
                {edition.intro.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
                <p className="home-story__kicker">Tenterez-vous l’aventure ?</p>
            </div>
            <figure className="home-story__figure">
                <img src={edition.images[0].src} alt="" loading="lazy" />
                <figcaption>{edition.images[0].caption}</figcaption>
            </figure>
        </section>

        <section className="home-section">
            <div className="eyebrow">Infos pratiques</div>
            <h2>Tout ce qu’il faut savoir</h2>
            <div className="bento">
                <article className="bento__card bento__card--sea">
                    <Icon name="calendar" size={28} />
                    <h3>C’est quand ?</h3>
                    <p className="bento__big">{edition.dates.label}</p>
                    <p>
                        Tous nos duos sont attendus avec impatience à Houlgate, qu’ils viennent du
                        passé ou de votre assiette ! Seul votre lit est à réserver sur ce site.
                    </p>
                </article>
                <article className="bento__card bento__card--accent">
                    <Icon name="clock" size={28} />
                    <h3>Le shotgun</h3>
                    <p className="bento__big">{edition.shotgun.label}</p>
                    <p>
                        Soyez présents {edition.shotgun.long} pour choisir votre meilleur hamac.
                        D’ici là, <Link to="/register">inscrivez-vous</Link> et vérifiez que vous
                        pouvez vous connecter.
                    </p>
                    <a
                        className="btn btn--sm"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={edition.guideUrl}
                    >
                        <Icon name="book" size={16} />
                        Lire le guide du shotgun
                    </a>
                </article>
                <article className="bento__card">
                    <Icon name="message" size={28} />
                    <h3>Restez informés</h3>
                    <p>
                        Pour être notifié au moment du shotgun et suivre toutes les actualités du{" "}
                        {edition.name} : rendez-vous sur le groupe WhatsApp de l’évènement !
                    </p>
                </article>
                <article className="bento__card bento__card--amber">
                    <Icon name="sparkles" size={28} />
                    <h3>Pas de lit ? Pas de panique.</h3>
                    <p>{edition.tentNote}</p>
                </article>
            </div>
        </section>

        <section className="home-section home-duo">
            {edition.images.slice(1).map((image) => (
                <figure key={image.src}>
                    <img src={image.src} alt="" loading="lazy" />
                    <figcaption>{image.caption}</figcaption>
                </figure>
            ))}
        </section>

        <section className="home-section">
            <div className="eyebrow">Sur ce site</div>
            <h2>Vous êtes à la bonne adresse.</h2>
            <div className="quick-links">
                {QUICK_LINKS.map((link) => (
                    <Link key={link.to} to={link.to} className="quick-link">
                        <span className="quick-link__icon">
                            <Icon name={link.icon} size={26} />
                        </span>
                        <span className="quick-link__title">{link.title}</span>
                        <span className="quick-link__text">{link.text}</span>
                        <Icon name="arrowRight" className="quick-link__arrow" />
                    </Link>
                ))}
            </div>
            <p className="home-signature">— Les orgas</p>
        </section>
    </div>
);

export default Homepage;
