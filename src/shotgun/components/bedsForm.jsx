import React, { useState } from "react";

import { Button, Select } from "../../ui";

const byUsername = (a, b) => a.username.localeCompare(b.username, "fr", { sensitivity: "base" });

// Who sleeps in which bed: the first bed is the user's, each other one gets a person among
// `availablePersons` (activated, without a room). A person chosen for a bed isn't offered for the
// others. Every bed has to be given before confirming.
const BedsForm = ({
    numberOfBeds,
    availablePersons,
    currentUser,
    onSubmit,
    submitting = false,
}) => {
    const [beds, setBeds] = useState(() => new Array(numberOfBeds - 1).fill(""));

    // Someone chosen may have taken another room since: their bed is free again
    const availableIds = availablePersons.map((person) => person._id);
    const chosen = beds.map((userId) => (availableIds.includes(userId) ? userId : ""));
    const candidates = availablePersons
        .filter((person) => person._id !== currentUser._id)
        .sort(byUsername);
    const complete = chosen.every(Boolean);

    const choose = (index, userId) => {
        const next = chosen.slice();
        next[index] = userId;
        setBeds(next);
    };

    return (
        <form
            className="form"
            onSubmit={(event) => {
                event.preventDefault();
                if (complete && !submitting) onSubmit(chosen);
            }}
        >
            <Select
                label="Lit 1"
                options={[{ value: currentUser._id, label: currentUser.username + " (toi)" }]}
                value={currentUser._id}
                disabled
            />
            {chosen.map((userId, index) => (
                <Select
                    key={index}
                    label={"Lit " + (index + 2)}
                    placeholder="Choisir quelqu'un"
                    value={userId}
                    onChange={(event) => choose(index, event.target.value)}
                    options={candidates
                        .filter((person) => person._id === userId || !chosen.includes(person._id))
                        .map((person) => ({ value: person._id, label: person.username }))}
                />
            ))}
            <div className="form__actions">
                <Button type="submit" icon="check" disabled={!complete} loading={submitting}>
                    Confirmer
                </Button>
            </div>
        </form>
    );
};

export default BedsForm;
