import React from "react";

import { PageHead } from "../ui";

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
const CheckList = ({ title, number, items }) => (
    <section className="checklist">
        <h2 className="checklist__title">
            <span className="checklist__num">{number}</span> {title}
        </h2>
        <ul className="checklist__items">
            {items.map((item) => (
                <li key={item}>
                    <label className="check checklist__item">
                        <input type="checkbox" />
                        <span>{item}</span>
                    </label>
                </li>
            ))}
        </ul>
    </section>
);

let ChecklistPage = () => (
    <div>
        <PageHead kicker="Rien oublier" title="Checklist" />
        <div className="checklists">
            <CheckList number="01" title="Avant le weekend" items={BEFORE_ITEMS} />
            <CheckList number="02" title="Pour le weekend" items={PACKING_ITEMS} />
        </div>
    </div>
);

export default ChecklistPage;
