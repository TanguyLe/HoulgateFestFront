import React from "react";

import { Card } from "../../ui";
import "../login.css";

// The frame of the account pages: one centred card with the page title
const AccountCard = ({ title, intro, children }) => (
    <Card variant="outlined" className="account-card">
        <h1 className="headline-small">{title}</h1>
        {intro && <p className="body-medium on-surface-variant">{intro}</p>}
        {children}
    </Card>
);

export default AccountCard;
