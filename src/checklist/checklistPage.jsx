import React from "react";

import { PageHeader } from "../ui/components";

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
const CheckList = ({ items }) => (
    <ul className="checklist">
        {items.map((item) => (
            <li key={item}>
                <label>
                    <input type="checkbox" />
                    {item}
                </label>
            </li>
        ))}
    </ul>
);

const ChecklistPage = () => (
    <>
        <PageHeader title="Checklist" />
        <h2>Avant le weekend</h2>
        <CheckList items={BEFORE_ITEMS} />
        <h2>Pour le weekend</h2>
        <CheckList items={PACKING_ITEMS} />
    </>
);

export default ChecklistPage;
