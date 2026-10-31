import React from "react";

import { PageHeader } from "../ui";

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

// The boxes are only a help to go through the list: nothing is saved
const CheckList = ({ title, items }) => (
    <section className="checklist card card--striped">
        <h2 className="checklist__title">{title}</h2>
        <ul className="checklist__list">
            {items.map((item) => (
                <li key={item}>
                    <label className="check">
                        <input type="checkbox" />
                        <span>{item}</span>
                    </label>
                </li>
            ))}
        </ul>
    </section>
);

let ChecklistPage = () => (
    <div className="checklist-page">
        <PageHeader kicker="Avant de prendre la route" title="Checklist">
            <p>Coche au fur et à mesure, rien n’est enregistré : c’est juste pour ta conscience.</p>
        </PageHeader>
        <div className="checklist-grid">
            <CheckList title="Avant le weekend" items={BEFORE_ITEMS} />
            <CheckList title="Pour le weekend" items={PACKING_ITEMS} />
        </div>
    </div>
);

export default ChecklistPage;
