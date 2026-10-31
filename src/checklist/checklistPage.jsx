import React, { useState } from "react";

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

const ALL_ITEMS = [...BEFORE_ITEMS, ...PACKING_ITEMS];

const CHEERS = [
    "C'est parti, coche tout ça !",
    "Bon début !",
    "Ça avance !",
    "Plus que quelques trucs...",
    "Presque prêt·e !",
    "Tu y es presque !",
    "Encore un effort !",
    "Prêt·e pour Houlgate ! 🎉",
];

// The boxes are only a help to go through the list: nothing is saved
const CheckList = ({ items, checked, onToggle }) => (
    <ul className="checklist">
        {items.map((item) => (
            <li key={item}>
                <label className={"checklist__item" + (checked[item] ? " is-checked" : "")}>
                    <input
                        type="checkbox"
                        checked={!!checked[item]}
                        onChange={() => onToggle(item)}
                    />
                    <span className="checklist__box" aria-hidden="true" />
                    <span className="checklist__text">{item}</span>
                </label>
            </li>
        ))}
    </ul>
);

let ChecklistPage = () => {
    const [checked, setChecked] = useState({});
    const toggle = (item) => setChecked({ ...checked, [item]: !checked[item] });
    const count = ALL_ITEMS.filter((item) => checked[item]).length;
    const cheer = CHEERS[Math.round((count / ALL_ITEMS.length) * (CHEERS.length - 1))];

    return (
        <div className="narrow">
            <header className="page-header">
                <span className="sticker sticker--mint" style={{ "--tilt": "-3deg" }}>
                    Rien d'oublié ?
                </span>
                <h1>
                    Checklist{" "}
                    <span className="emoji" aria-hidden="true">
                        ✅
                    </span>
                </h1>
            </header>
            <div className="card checklist-card">
                <div className="checklist-progress" aria-live="polite">
                    <div className="checklist-progress__head">
                        <span>{cheer}</span>
                        <b>
                            {count}/{ALL_ITEMS.length}
                        </b>
                    </div>
                    <div className="checklist-progress__bar">
                        <span style={{ width: (count / ALL_ITEMS.length) * 100 + "%" }} />
                    </div>
                </div>
                <h2 className="checklist__heading">
                    <span className="emoji" aria-hidden="true">
                        🗓️
                    </span>{" "}
                    Avant le weekend
                </h2>
                <CheckList items={BEFORE_ITEMS} checked={checked} onToggle={toggle} />
                <h2 className="checklist__heading">
                    <span className="emoji" aria-hidden="true">
                        🧳
                    </span>{" "}
                    Pour le weekend
                </h2>
                <CheckList items={PACKING_ITEMS} checked={checked} onToggle={toggle} />
            </div>
        </div>
    );
};

export default ChecklistPage;
