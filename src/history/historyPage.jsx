import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ImagesCarousel from "./components/carousel";
import { getArchive, HISTORY_AUTHORS, themeStyle } from "../editions/themes";
import { Dialog, Icon, PageHeader } from "../ui";

const ARCHIVE = getArchive();

const PosterCard = ({ edition, featured, onOpen }) => (
    <li className={"wall__item" + (featured ? " wall__item--featured" : "")}>
        <button
            type="button"
            className="poster-card themed"
            style={themeStyle(edition)}
            onClick={onOpen}
            aria-haspopup="dialog"
        >
            <span className="poster-card__frame">
                {edition.banner ? (
                    <img src={edition.banner} alt="" loading="lazy" />
                ) : (
                    <span className="poster-card__placeholder" aria-hidden="true" />
                )}
            </span>
            <span className="poster-card__caption">
                <span className="poster-card__year">{edition.year}</span>
                <span className="poster-card__name">{edition.name}</span>
                {edition.dates && <span className="poster-card__dates">{edition.dates}</span>}
            </span>
            <span className="poster-card__more" aria-hidden="true">
                <Icon name="arrow" size={18} />
            </span>
        </button>
    </li>
);

const EditionStory = ({ edition }) => {
    const story = edition.story || edition.intro || [];

    return (
        <div className="edition themed" style={themeStyle(edition)}>
            <div className="edition__intro">
                {edition.banner && <img className="edition__banner" src={edition.banner} alt="" />}
                <div>
                    <span className="kicker">
                        {edition.dates ? edition.dates + " " + edition.year : edition.year}
                    </span>
                    <p className="edition__subtitle">{edition.subtitle}</p>
                    <p className="edition__tagline">{edition.tagline}</p>
                    {edition.link && (
                        <a
                            href={edition.link}
                            target="_blank"
                            rel="noreferrer"
                            className="edition__link"
                        >
                            L’évènement d’époque <Icon name="external" size={16} />
                        </a>
                    )}
                </div>
            </div>
            <div className="edition__story">
                {story.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                {!edition.story && (
                    <p className="muted">
                        Le récit de cette édition reste à écrire… avis aux plumes !
                    </p>
                )}
            </div>
            <ImagesCarousel
                images={edition.photos.map((path) => ({ path }))}
                label={"Photos de l’édition " + edition.year}
            />
            {edition.story && <p className="edition__signature">{HISTORY_AUTHORS}</p>}
        </div>
    );
};

// The archive as a wall of posters, each one opening its story (deep-linkable: /history#2023)
const HistoryPage = () => {
    const { hash } = useLocation();
    const navigate = useNavigate();

    const openYear = Number(hash.replace("#", ""));
    const opened = ARCHIVE.find((edition) => edition.year === openYear);

    const open = (year) => navigate({ hash: String(year) }, { replace: !!opened });
    const close = () => navigate({ hash: "" }, { replace: true });

    return (
        <div className="WelcomePage history">
            <PageHeader kicker="Les archives de la Villa Les Genêts" title="Gloryhoul of Fame">
                <p>
                    Depuis 2018, chaque édition a eu son thème, ses défis et ses légendes. Choisis
                    une affiche pour revivre l’épopée.
                </p>
            </PageHeader>

            <ol className="wall">
                {ARCHIVE.map((edition, index) => (
                    <PosterCard
                        key={edition.year}
                        edition={edition}
                        featured={index === 0}
                        onOpen={() => open(edition.year)}
                    />
                ))}
            </ol>

            <Dialog
                open={!!opened}
                onClose={close}
                className="dialog--wide themed"
                style={opened ? themeStyle(opened) : undefined}
                title={opened ? opened.year + " · " + opened.name : ""}
            >
                {opened && <EditionStory edition={opened} />}
            </Dialog>
        </div>
    );
};

export default HistoryPage;
