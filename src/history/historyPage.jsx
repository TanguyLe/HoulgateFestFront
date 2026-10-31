import React, { useState } from "react";

import { editions, historySignature } from "../content/editions";
import { photos } from "../content/photos";
import { Button, EditionBadge, Photo, PhotoViewer } from "../ui";
import "./history.css";

// One edition, in its own colours (`.edition-<year>`, from its old poster)
const EditionCard = ({ edition }) => {
    const [viewed, setViewed] = useState(null);
    const titleId = "edition-" + edition.year;

    return (
        <li>
            <article className={"edition-card edition-" + edition.year} aria-labelledby={titleId}>
                <header className="edition-card__header">
                    <EditionBadge year={edition.year} />
                    <div>
                        <h2 id={titleId} className="headline-small">
                            <span className="visually-hidden">{edition.year} : </span>
                            {edition.name}
                        </h2>
                        <p className="body-medium on-surface-variant">{edition.dates}</p>
                    </div>
                </header>
                <div className="prose body-large">
                    {edition.text.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>
                <ul
                    className={
                        "edition-card__photos edition-card__photos--" + edition.photos.length
                    }
                >
                    {edition.photos.map((id, index) => (
                        <li key={id}>
                            <button
                                type="button"
                                className="photo-button"
                                onClick={() => setViewed(index)}
                                aria-label={"Agrandir : " + photos[id].alt}
                            >
                                <Photo
                                    id={id}
                                    sizes="(min-width: 840px) 340px, (min-width: 600px) 45vw, 90vw"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
                {edition.url && (
                    <Button variant="text" href={edition.url} trailingIcon="openInNew">
                        L'événement Facebook
                    </Button>
                )}
                <PhotoViewer
                    ids={edition.photos}
                    index={viewed}
                    onChange={setViewed}
                    onClose={() => setViewed(null)}
                    label={"Photos de l'édition " + edition.year}
                />
            </article>
        </li>
    );
};

const HistoryPage = () => (
    <>
        <header className="page-header">
            <h1 className="headline-large">Gloryhoul of Fame</h1>
            <p className="body-large on-surface-variant">
                Toutes les éditions depuis 2018, de la plus récente à la première.
            </p>
        </header>
        <ol className="editions">
            {editions.map((edition) => (
                <EditionCard key={edition.year} edition={edition} />
            ))}
        </ol>
        <p className="editions__signature title-medium">{historySignature}</p>
    </>
);

export default HistoryPage;
