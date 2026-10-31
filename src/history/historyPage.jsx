import React from "react";

import withRouter from "../utils/withRouter";
import { getArchive, HISTORY_SIGNATURE } from "../editions/themes";
import { Marquee, cx } from "../ui";
import Icon from "../ui/icons";

const themeStyle = (theme) => ({ "--accent": theme.accent, "--accent-ink": theme.accentInk });

const EditionStory = ({ theme, onClose }) => (
    <article
        className="hof-story"
        id={"edition-" + theme.year}
        style={themeStyle(theme)}
        aria-labelledby={"edition-title-" + theme.year}
    >
        <div className="hof-story__head">
            <p className="hof-story__year display">{theme.year}</p>
            <div>
                <h2 className="hof-story__title" id={"edition-title-" + theme.year}>
                    {theme.name}
                </h2>
                <p className="label hof-story__when">{theme.when}</p>
            </div>
            <button type="button" className="hof-story__close" onClick={onClose}>
                <Icon name="close" />
                <span className="visually-hidden">Fermer l'édition {theme.year}</span>
            </button>
        </div>
        <div className="hof-story__body">
            <img className="hof-story__banner" src={theme.banner} alt={"Affiche " + theme.name} />
            <div className="prose">
                {theme.story.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
                {theme.link && (
                    <p>
                        <a href={theme.link} target="_blank" rel="noopener noreferrer">
                            L'évènement Facebook ↗
                        </a>
                    </p>
                )}
            </div>
        </div>
        {theme.pictures && (
            <ul className="hof-photos" aria-label={"Photos " + theme.year}>
                {theme.pictures.map((src, index) => (
                    <li key={src}>
                        <a href={src} target="_blank" rel="noopener noreferrer">
                            <img
                                src={src}
                                alt={"Photo " + (index + 1) + " de l'édition " + theme.year}
                                loading="lazy"
                            />
                        </a>
                    </li>
                ))}
            </ul>
        )}
    </article>
);

// Wall of the posters of the past editions, each one opens its story and photos
class HistoryPage extends React.Component {
    constructor(props) {
        super(props);

        const archive = getArchive();
        const fromHash = Number((props.location.hash || "").replace("#", ""));
        this.archive = archive;
        this.state = {
            open: archive.some((theme) => theme.year === fromHash) ? fromHash : null,
        };
    }

    componentDidMount() {
        if (this.state.open) this.scrollTo(this.state.open);
    }

    scrollTo(year) {
        // after the render of the story
        window.requestAnimationFrame(() => {
            const element = document.getElementById("edition-" + year);
            if (element) element.scrollIntoView({ block: "start" });
        });
    }

    toggle(year) {
        const open = this.state.open === year ? null : year;
        this.setState({ open: open }, () => {
            window.history.replaceState(null, "", open ? "#" + open : window.location.pathname);
            if (open) this.scrollTo(open);
            else {
                const tile = document.getElementById("poster-" + year);
                if (tile) tile.focus();
            }
        });
    }

    render() {
        const { open } = this.state;
        const years = this.archive.map((theme) => theme.year);

        return (
            <div className="hof">
                <header className="hof-head">
                    <p className="label">
                        {years[years.length - 1]} — {years[0]} · {years.length} éditions
                    </p>
                    <h1 className="hof-head__title">
                        Gloryhoul
                        <br />
                        of Fame
                    </h1>
                </header>
                <Marquee items={this.archive.map((theme) => theme.year + " " + theme.name)} />

                <ol className="hof-wall">
                    {this.archive.map((theme) => {
                        const isOpen = open === theme.year;
                        return (
                            <React.Fragment key={theme.year}>
                                <li
                                    className={cx("hof-tile", isOpen && "hof-tile--open")}
                                    style={themeStyle(theme)}
                                >
                                    <button
                                        type="button"
                                        id={"poster-" + theme.year}
                                        className="hof-tile__button"
                                        aria-expanded={isOpen}
                                        aria-controls={"edition-" + theme.year}
                                        onClick={() => this.toggle(theme.year)}
                                    >
                                        <img
                                            className="hof-tile__img"
                                            src={theme.banner}
                                            alt=""
                                            loading="lazy"
                                        />
                                        <span className="hof-tile__year display">{theme.year}</span>
                                        <span className="hof-tile__name">{theme.name}</span>
                                        <span className="hof-tile__more label">
                                            {isOpen ? "Fermer" : "L'histoire"}
                                        </span>
                                    </button>
                                </li>
                                {isOpen && (
                                    <li className="hof-wall__story">
                                        <EditionStory
                                            theme={theme}
                                            onClose={() => this.toggle(theme.year)}
                                        />
                                    </li>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ol>
                <p className="hof-signature display">{HISTORY_SIGNATURE}</p>
            </div>
        );
    }
}

export default withRouter(HistoryPage);
