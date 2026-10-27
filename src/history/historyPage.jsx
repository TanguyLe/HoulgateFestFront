import React from "react";

import Icon from "../ui/icon";
import { Gallery, PageHeader } from "../ui/components";
import { EDITIONS } from "./editions";

const Edition = ({ edition }) => (
    <article className="edition" id={"edition-" + edition.year}>
        <div className="edition__year" aria-hidden>
            {edition.year}
        </div>
        <div className="edition__body">
            <header className="edition__header">
                <div className="edition__meta">
                    <span className="chip">
                        <Icon name="calendar" size={14} />
                        {edition.dates} {edition.year}
                    </span>
                    {edition.winner && (
                        <span className="chip">
                            <Icon name="trophy" size={14} />
                            {edition.winner}
                        </span>
                    )}
                </div>
                <h2>
                    <span className="visually-hidden">{edition.year} : </span>
                    {edition.title}
                </h2>
                {edition.link && (
                    <a
                        className="edition__link"
                        href={edition.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        L’évènement Facebook <Icon name="external" size={14} />
                    </a>
                )}
            </header>
            <img className="edition__banner" src={edition.banner} alt="" loading="lazy" />
            <div className="edition__text">
                {edition.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
            </div>
            <Gallery images={edition.photos} label={edition.title} />
        </div>
    </article>
);

const HistoryPage = () => (
    <div className="history">
        <PageHeader title="Gloryhoul of Fame">
            Sept éditions, des tribus, des sorciers, des Schtroumpfs. Voici la légende.
        </PageHeader>
        <nav className="history__jump" aria-label="Aller à une édition">
            {EDITIONS.map((edition) => (
                <a key={edition.year} href={"#edition-" + edition.year} className="chip">
                    {edition.year}
                </a>
            ))}
        </nav>
        <div className="timeline">
            {EDITIONS.map((edition) => (
                <Edition key={edition.year} edition={edition} />
            ))}
        </div>
        <p className="home-signature">— Hugo Bis & Raphoune</p>
    </div>
);

export default HistoryPage;
