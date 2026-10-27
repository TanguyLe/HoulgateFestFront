import React from "react";
import { Link } from "react-router-dom";

import { CURRENT_EDITION as edition } from "../content/edition";
import { withOrdinals } from "../utils/frenchText";

// The orgas' own words, laid out like the printed programme of the weekend
const Homepage = () => (
    <div className="home">
        <section className="hero">
            <div className="hero__inner">
                <div className="hero__copy">
                    <h1 className="hero__title">{edition.name}</h1>
                    <p className="hero__tagline">{edition.tagline}</p>
                    <dl className="hero__facts">
                        <div>
                            <dt>Quand</dt>
                            <dd>{edition.dates.label}</dd>
                        </div>
                        <div>
                            <dt>Où</dt>
                            <dd>Villa Les Genêts, Houlgate</dd>
                        </div>
                        <div>
                            <dt>Shotgun des lits</dt>
                            <dd>{withOrdinals(edition.shotgun.label)}</dd>
                        </div>
                    </dl>
                    <div className="hero__actions">
                        <Link to="/register" className="btn btn--primary btn--lg">
                            Je m’inscris
                        </Link>
                        <Link to="/shotgun" className="btn btn--lg">
                            Aller au shotgun
                        </Link>
                    </div>
                </div>
                <img
                    className="hero__badge"
                    src={edition.badge}
                    alt={"Badge " + edition.name + " " + edition.year}
                    width="1024"
                    height="1024"
                />
            </div>
        </section>

        <div className="keywords">
            <div className="keywords__line">
                <ul aria-label="Le thème en quelques mots">
                    {edition.keywords.map((word) => (
                        <li key={word}>{word}</li>
                    ))}
                </ul>
            </div>
        </div>

        <article className="programme">
            <section className="programme__row">
                <div>
                    <h2>{edition.theme}</h2>
                    {edition.intro.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                    <p>
                        <strong>Tenterez-vous l’aventure ?</strong>
                    </p>
                </div>
                <img src={edition.images[0]} alt="" loading="lazy" />
            </section>

            <section className="programme__facts">
                <div>
                    <h2>C’est quand ?</h2>
                    <p className="programme__big">{edition.dates.label}</p>
                    <p>
                        Comme dit plus haut, tous nos duos sont attendus avec impatience à Houlgate,
                        qu’ils viennent du passé ou de votre assiette ! Cependant, seul votre lit
                        est à réserver sur ce site !
                    </p>
                </div>
                <div>
                    <h2>Le shotgun</h2>
                    <p className="programme__big">{withOrdinals(edition.shotgun.label)}</p>
                    <p>
                        Soyez présents {withOrdinals(edition.shotgun.long)} sur cette plateforme
                        pour choisir votre meilleur hamac ! D’ici là pensez à vous{" "}
                        <Link to="/register">inscrire</Link> et vérifiez bien que vous pouvez vous
                        connecter en amont. Le{" "}
                        <a target="_blank" rel="noopener noreferrer" href={edition.guideUrl}>
                            guide
                        </a>{" "}
                        devrait vous aider à vous préparer.
                    </p>
                    <p>
                        <strong>Organisez-vous pour le shotgun !</strong>
                    </p>
                </div>
                <div>
                    <h2>Restez informés</h2>
                    <p>
                        Pour être notifié directement au moment du shotgun et au courant de toutes
                        les actualités du {edition.name} : rendez-vous sur le groupe WhatsApp de
                        l’évènement !
                    </p>
                </div>
            </section>

            <section className="programme__row programme__row--small-picture">
                <div>
                    <h2>#PosticheMoustachu</h2>
                    <p>{edition.tentNote}</p>
                </div>
                <img src={edition.images[1]} alt="" loading="lazy" />
            </section>

            <p className="programme__credit">
                Illustrations : les orgas et une IA un peu trop motivée.
            </p>

            <section className="programme__end">
                <p>
                    Sur ce site vous êtes à la bonne adresse si vous voulez{" "}
                    <Link to="/shotgun">shotgun votre chambre</Link>, débusquer{" "}
                    <Link to="/trips">un trajet en voiture</Link> ou suivre en direct le{" "}
                    <Link to="/scores">tableau des scores</Link>.
                </p>
                <p>
                    <strong>Les orgas</strong>
                </p>
            </section>
        </article>
    </div>
);

export default Homepage;
