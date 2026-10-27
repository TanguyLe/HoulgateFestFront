import React from "react";
import { Checkbox, Header, List } from "semantic-ui-react";

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
    <List relaxed>
        {items.map((item) => (
            <List.Item key={item}>
                <Checkbox label={item} />
            </List.Item>
        ))}
    </List>
);

let ChecklistPage = () => (
    <div>
        <h1> Checklist </h1>
        <Header as="h3">Avant le weekend</Header>
        <CheckList items={BEFORE_ITEMS} />
        <Header as="h3">Pour le weekend</Header>
        <CheckList items={PACKING_ITEMS} />
    </div>
);

export default ChecklistPage;
