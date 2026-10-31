import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./history.css";
import { Modal } from "../ui";
import { getAllThemes, getThemeStyle, HISTORY_SIGNATURE } from "../editions/themes";

const Emoji = ({ children }) => (
    <span className="emoji" aria-hidden="true">
        {children}
    </span>
);

// The editions with something to tell
const EDITIONS = getAllThemes().filter((theme) => theme.story || theme.intro.length);

const Poster = ({ theme, index }) => (
    <li className="poster-wrap" style={{ "--tilt": [-2, 1.5, -1, 2.5][index % 4] + "deg" }}>
        <Link
            to={"/history/" + theme.year}
            className="poster"
            style={getThemeStyle(theme)}
            aria-label={theme.year + " : " + theme.name + ", lire l'histoire"}
        >
            <span className="poster__year">{theme.year}</span>
            <span className="poster__art">
                {theme.banner ? (
                    <img src={theme.banner} alt="" loading="lazy" />
                ) : (
                    <Emoji>{theme.emoji}</Emoji>
                )}
            </span>
            <span className="poster__caption">
                <span className="poster__name">{theme.name}</span>
                {theme.datesLabel && <span className="poster__dates">{theme.datesLabel}</span>}
            </span>
            {theme.sticker && (
                <span className="sticker sticker--yellow poster__sticker">
                    <Emoji>{theme.emoji}</Emoji> {theme.sticker}
                </span>
            )}
        </Link>
    </li>
);

const Gallery = ({ photos, name }) => (
    <div className="gallery" role="region" aria-label={"Photos de " + name} tabIndex={0}>
        {photos.map((photo, index) => (
            <a
                key={photo}
                href={photo}
                target="_blank"
                rel="noreferrer"
                className="gallery__item"
                style={{ "--tilt": (index % 2 ? 1.5 : -1.5) + "deg" }}
            >
                <img src={photo} alt={name + ", photo " + (index + 1)} loading="lazy" />
            </a>
        ))}
    </div>
);

const EditionStory = ({ theme, onClose, previous, next }) => (
    <Modal
        wide
        onClose={onClose}
        title={
            <>
                <Emoji>{theme.emoji}</Emoji> {theme.year} : {theme.name}
            </>
        }
    >
        <div className="edition-story" style={getThemeStyle(theme)}>
            {theme.banner && (
                <div className="edition-story__banner">
                    <img src={theme.banner} alt={"Bannière de l'édition " + theme.year} />
                </div>
            )}
            <div className="row">
                {theme.datesLabel && (
                    <span className="chip chip--plain">
                        <Emoji>📅</Emoji> {theme.datesLabel}
                    </span>
                )}
                {theme.link && (
                    <a href={theme.link} target="_blank" rel="noreferrer" className="small">
                        L'évènement Facebook ↗
                    </a>
                )}
            </div>
            {!theme.story && <h3 className="edition-story__pitch">Le pitch</h3>}
            {(theme.story || theme.intro).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
            ))}
            {theme.photos && theme.photos.length > 0 && (
                <Gallery photos={theme.photos} name={theme.name} />
            )}
            <nav className="edition-story__nav" aria-label="Autres éditions">
                {next ? (
                    <Link to={"/history/" + next.year} className="btn btn--sm">
                        ← {next.year}
                    </Link>
                ) : (
                    <span />
                )}
                {previous && (
                    <Link to={"/history/" + previous.year} className="btn btn--sm">
                        {previous.year} →
                    </Link>
                )}
            </nav>
        </div>
    </Modal>
);

const HistoryPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const openYear = Number((params["*"] || "").split("/")[0]);
    const openIndex = EDITIONS.findIndex((theme) => theme.year === openYear);

    return (
        <div className="history">
            <header className="page-header history__header">
                <span className="sticker sticker--pink" style={{ "--tilt": "-4deg" }}>
                    Depuis 2018
                </span>
                <h1>
                    Gloryhoul of Fame <Emoji>🏆</Emoji>
                </h1>
                <p>
                    Toutes les éditions, leurs légendes et leurs vainqueurs. Clique sur une affiche
                    pour revivre le weekend !
                </p>
            </header>
            <ol className="poster-wall">
                {EDITIONS.map((theme, index) => (
                    <Poster key={theme.year} theme={theme} index={index} />
                ))}
            </ol>
            <p className="history__signature">{HISTORY_SIGNATURE}</p>
            {openIndex !== -1 && (
                <EditionStory
                    key={openYear}
                    theme={EDITIONS[openIndex]}
                    previous={EDITIONS[openIndex + 1]}
                    next={EDITIONS[openIndex - 1]}
                    onClose={() => navigate("/history")}
                />
            )}
        </div>
    );
};

export default HistoryPage;
