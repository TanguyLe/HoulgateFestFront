import React, { useState } from "react";

import { Card, Checkbox } from "../ui";
import "./checklist.css";

const BEFORE_ITEMS = [
    "J'ai trouvé un véhicule ou un billet de train pour venir",
    "J'ai payé ma place",
    "J'ai réservé une chambre",
];

const PACKING_ITEMS = [
    "J'ai pris des draps",
    "J'ai pris un matelas (si possible)",
    "J'ai pris des vêtements de plage, et de froid si on sort la nuit",
    "J'ai préparé mon déguisement",
];

// The ticks are kept in this browser only
const STORAGE_KEY = "checklist";

const readTicks = () => {
    try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
};

const CheckList = ({ title, items, ticks, onToggle }) => {
    const done = items.filter((item) => ticks[item]).length;

    return (
        <Card as="section" className="checklist" aria-label={title}>
            <h2 className="title-large">
                {title}{" "}
                <span className="checklist__count body-medium">
                    {done}/{items.length}
                </span>
            </h2>
            <ul className="checklist__items">
                {items.map((item) => (
                    <li key={item}>
                        <Checkbox
                            label={item}
                            checked={Boolean(ticks[item])}
                            onChange={() => onToggle(item)}
                        />
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const ChecklistPage = () => {
    const [ticks, setTicks] = useState(readTicks);

    const toggle = (item) => {
        const next = { ...ticks, [item]: !ticks[item] };
        setTicks(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // private browsing: the ticks last until the page is closed
        }
    };

    return (
        <>
            <header className="page-header">
                <h1 className="headline-large">Checklist</h1>
                <p className="body-large on-surface-variant">
                    De quoi ne rien oublier. Tes cases cochées restent sur ce téléphone ou cet
                    ordinateur.
                </p>
            </header>
            <div className="checklists">
                <CheckList
                    title="Avant le weekend"
                    items={BEFORE_ITEMS}
                    ticks={ticks}
                    onToggle={toggle}
                />
                <CheckList
                    title="Pour le weekend"
                    items={PACKING_ITEMS}
                    ticks={ticks}
                    onToggle={toggle}
                />
            </div>
        </>
    );
};

export default ChecklistPage;
