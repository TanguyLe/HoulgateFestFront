import React, { useEffect, useState } from "react";

import BedsForm from "./bedsForm";
import PreShotgunTimer from "./preShotgunTimer";
import { Button, Dialog, Loading, Notice } from "../../ui";

// The states of the room the sheet follows through the steps
const STEP_STATES = ["loading", "pendingMine", "mine"];

const Step = ({ number, children }) => (
    <p className="shotgun-sheet__step label-large">
        Étape {number} sur 3 · {children}
    </p>
);

// The steps of a shotgun, in a bottom sheet on phones and a dialog above: the room is being
// booked, then the user picks their roommates, then it's done. The owner can cancel from here.
const ShotgunSheet = ({
    room,
    state,
    startedHere,
    occupants,
    currentUser,
    availablePersons,
    isOwner,
    onSubmitBeds,
    onCancel,
    onClose,
}) => {
    const [confirmingCancel, setConfirmingCancel] = useState(false);
    const [seenStep, setSeenStep] = useState(!startedHere);
    const [reachedBeds, setReachedBeds] = useState(state === "pendingMine");

    // Opened by "Shotgun", the room is still free until the API answers
    useEffect(() => {
        if (state === "pendingMine") setReachedBeds(true);
        if (STEP_STATES.includes(state)) setSeenStep(true);
        // Any state the sheet can't show closes it: someone else took the room (pending, taken),
        // or the user's room is elsewhere (locked). A refresh may briefly show the room free while
        // it is being booked: free only closes the sheet once the pre-shotgun existed (expired)
        else if (state !== "free" || (seenStep && reachedBeds)) onClose();
    }, [state, seenStep, reachedBeds]);

    const what = state === "pendingMine" ? "pré-shotgun" : "shotgun";
    let content;

    if (state === "loading" && reachedBeds)
        content = (
            <>
                <Step number={2}>Qui dort avec toi ?</Step>
                <Loading>Enregistrement…</Loading>
            </>
        );
    else if (state === "loading" || (state === "free" && !reachedBeds))
        content = (
            <>
                <Step number={1}>La chambre</Step>
                <Loading>Shotgun en cours…</Loading>
            </>
        );
    else if (state === "pendingMine")
        content = (
            <>
                <Step number={2}>Qui dort avec toi ?</Step>
                {room.preShotgunExpiry && (
                    <Notice tone="warning" icon="schedule">
                        <PreShotgunTimer expiry={room.preShotgunExpiry} label="Il te reste" /> pour
                        confirmer, sinon la chambre est libérée.
                    </Notice>
                )}
                <BedsForm
                    numberOfBeds={room.seats}
                    availablePersons={availablePersons}
                    currentUser={currentUser}
                    onSubmit={onSubmitBeds}
                />
            </>
        );
    else if (state === "mine")
        content = (
            <>
                <Step number={3}>C'est fait</Step>
                <Notice tone="success" title="Félicitations, tu as bien shotgun !">
                    <p>
                        {occupants.length > 1
                            ? "Avec " +
                              occupants.filter((name) => name !== currentUser.username).join(", ") +
                              ". "
                            : ""}
                        Réjouis-toi de voir ton nom gravé dans le marbre sur ce site. Tu es
                        maintenant responsable si quelqu'un veut échanger :)
                    </p>
                </Notice>
                <p>
                    Si c'est une erreur, la personne qui a shotgun la chambre peut l'annuler, et
                    sache que c'est pas malin !
                </p>
            </>
        );

    const cancel = isOwner && (state === "pendingMine" || state === "mine") && (
        <div className="shotgun-sheet__cancel">
            {confirmingCancel ? (
                <>
                    <p>
                        La chambre et toutes ses personnes seront libérées, et n'importe qui pourra
                        la shotgun. Personne n'est prévenu par email.
                    </p>
                    <div className="form__actions">
                        <Button
                            className="md-button--danger"
                            onClick={() => {
                                onClose();
                                onCancel();
                            }}
                        >
                            Oui, annuler mon {what}
                        </Button>
                        <Button variant="text" onClick={() => setConfirmingCancel(false)}>
                            Non
                        </Button>
                    </div>
                </>
            ) : (
                <Button
                    variant="text"
                    icon="cancel"
                    className="md-button--danger"
                    onClick={() => setConfirmingCancel(true)}
                >
                    Annuler mon {what}
                </Button>
            )}
        </div>
    );

    return (
        <Dialog
            open
            onClose={onClose}
            returnFocus={() => document.getElementById("room-" + room._id)}
            title={room.name + " · " + room.seats + " lits"}
            sheet
        >
            {content}
            {cancel}
        </Dialog>
    );
};

export default ShotgunSheet;
