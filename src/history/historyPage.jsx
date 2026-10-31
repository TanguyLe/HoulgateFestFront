import React, { useState } from "react";

import { editions, historySignature } from "../content/editions";
import { photos } from "../content/photos";
import { Button, Photo, PhotoViewer, Reveal, Shape } from "../ui";
import "./history.css";

// The four colours, and a shape each, taken in turn by the editions (not in the order of the
// Google logo)
const ACCENTS = [
    ["yellow", "half"],
    ["blue", "circle"],
    ["green", "square"],
    ["red", "triangle"],
];

// One edition, as a slide: its year huge in its colour, its name, its story, its photos
const EditionSlide = ({ edition, index }) => {
    const [viewed, setViewed] = useState(null);
    const titleId = "edition-" + edition.year;
    const [color, shape] = ACCENTS[index % ACCENTS.length];

    return (
        <Reveal as="li" className={"edition accent-" + color}>
            <article aria-labelledby={titleId}>
                <header className="edition__header">
                    <p className="edition__year" aria-hidden="true">
                        {edition.year}
                        <Shape kind={shape} color={color} className="edition__shape" />
                    </p>
                    <div className="edition__titles">
                        <p className="stage-eyebrow">{edition.dates}</p>
                        <h2 id={titleId} className="stage-subtitle">
                            <span className="visually-hidden">{edition.year} : </span>
                            {edition.name}
                        </h2>
                    </div>
                </header>
                <div className="edition__body">
                    <div className="edition__text">
                        {edition.text.map((paragraph) => (
                            <p key={paragraph} className="stage-lead">
                                {paragraph}
                            </p>
                        ))}
                        {edition.url && (
                            <Button variant="tonal" href={edition.url} trailingIcon="openInNew">
                                L'événement Facebook
                            </Button>
                        )}
                    </div>
                    {edition.photos.length > 0 && (
                        <ul className={"edition__photos edition__photos--" + edition.photos.length}>
                            {edition.photos.map((id, photoIndex) => (
                                <li key={id}>
                                    <button
                                        type="button"
                                        className="photo-button"
                                        onClick={() => setViewed(photoIndex)}
                                        aria-label={"Agrandir : " + photos[id].alt}
                                    >
                                        <Photo id={id} sizes="(min-width: 1100px) 1040px, 100vw" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <PhotoViewer
                    ids={edition.photos}
                    index={viewed}
                    onChange={setViewed}
                    onClose={() => setViewed(null)}
                    label={"Photos de l'édition " + edition.year}
                />
            </article>
        </Reveal>
    );
};

const HistoryPage = () => (
    <div className="history">
        <header className="history__header">
            <p className="stage-eyebrow">Depuis 2018</p>
            <h1 className="stage-headline">Gloryhoul of Fame</h1>
            <p className="stage-lead">Toutes les éditions, de la plus récente à la première.</p>
        </header>
        <ol className="editions">
            {editions.map((edition, index) => (
                <EditionSlide key={edition.year} edition={edition} index={index} />
            ))}
        </ol>
        <p className="editions__signature title-medium">{historySignature}</p>
    </div>
);

export default HistoryPage;
