import React, { useState } from "react";

import FloorPlan from "./floorPlan";
import PreShotgunTimer from "./preShotgunTimer";
import ShotgunSheet from "./shotgunSheet";
import { STATES, findCurrentUser, getOccupants, getRoomState } from "../roomStates";
import { getCredentials } from "../../login/store";
import { Button, Card, Icon } from "../../ui";
import "../shotgun.css";

const FLOOR_NAMES = {
    Rdc: "Rez-de-chaussée",
    "Premier Etage": "1er étage",
    "Deuxième Etage": "2e étage",
    Extérieur: "Extérieur",
};

const plural = (count, word) => count + " " + word + (count > 1 ? "s" : "");

// The second line of a room in the list
const describe = (room, state, occupants, currentUser) => {
    const others = occupants.filter((name) => name !== currentUser.username);

    switch (state) {
        case "free":
        case "locked":
            return plural(room.seats, "lit") + " libre" + (room.seats > 1 ? "s" : "");
        case "pending":
            return "Shotgun en cours par " + occupants[0];
        case "pendingMine":
            return "À toi de choisir qui dort avec toi";
        case "mine":
            return others.length ? "Avec " + others.join(", ") : plural(room.seats, "lit");
        case "taken":
            return occupants.join(", ");
        default:
            return plural(room.seats, "lit");
    }
};

const StateLabel = ({ state }) => (
    <span className={"room-state room-state--" + state + " label-medium"}>
        <Icon name={STATES[state].icon} />
        {STATES[state].label}
    </span>
);

const RoomItem = ({ room, number, state, occupants, currentUser, onShotgun, onOpen }) => {
    let action = null;
    if (state === "free")
        action = (
            <Button onClick={onShotgun} aria-label={"Shotgun " + room.name}>
                Shotgun
            </Button>
        );
    else if (state === "pendingMine")
        action = (
            <Button onClick={onOpen} aria-label={"Finaliser le shotgun de " + room.name}>
                Finaliser
            </Button>
        );
    else if (state === "mine")
        action = (
            <Button variant="tonal" onClick={onOpen} aria-label={"Voir " + room.name}>
                Voir
            </Button>
        );

    return (
        <li className={"room room-state--" + state} id={"room-" + room._id} tabIndex={-1}>
            <span className="room__number title-medium" aria-hidden="true">
                {number}
            </span>
            <div className="room__content">
                <p className="room__name body-large">
                    <span className="visually-hidden">Chambre {number} : </span>
                    {room.name}
                </p>
                <p className="room__supporting body-medium">
                    {describe(room, state, occupants, currentUser)}
                    {state === "pending" && room.preShotgunExpiry && (
                        <>
                            {" · "}
                            <PreShotgunTimer expiry={room.preShotgunExpiry} label="expire dans" />
                        </>
                    )}
                </p>
                <StateLabel state={state} />
            </div>
            {action && <div className="room__action">{action}</div>}
        </li>
    );
};

// The shotgun: one card per floor with its plan and its rooms, a summary bar at the bottom, and
// the steps of the user's shotgun in a sheet
const ShotgunBoard = ({
    floors,
    userInfo,
    createShotgunFunction,
    addPersonsInShotgunFunction,
    cancelShotgunFunction,
}) => {
    const [sheet, setSheet] = useState(null);
    const currentUser = findCurrentUser(userInfo, getCredentials().login);

    if (!currentUser) return null;

    // The API refuses to book accounts that aren't activated, so they aren't offered as roommates
    const availablePersons = Object.values(userInfo).filter(
        (person) =>
            (person.activated && person.hasShotgun === false) || currentUser._id === person._id,
    );

    // Rooms with beds are numbered across the house, floor after floor
    const numbers = {};
    const states = {};
    let count = 0;
    floors.forEach((floor) =>
        floor.rooms.forEach((room) => {
            if (room.seats > 0) {
                numbers[room._id] = ++count;
                states[room._id] = getRoomState(room, currentUser);
            }
        }),
    );

    const rooms = floors.flatMap((floor) => floor.rooms.filter((room) => room.seats > 0));
    const freeBeds = rooms
        .filter((room) => states[room._id] === "free" || states[room._id] === "locked")
        .reduce((sum, room) => sum + room.seats, 0);
    const myRoom = rooms.find(
        (room) => states[room._id] === "mine" || states[room._id] === "pendingMine",
    );
    const sheetRoom = sheet && rooms.find((room) => room._id === sheet.roomId);

    const showInList = (roomId) => {
        const item = document.getElementById("room-" + roomId);
        item.scrollIntoView({ behavior: "smooth", block: "center" });
        item.focus({ preventScroll: true });
    };

    return (
        <>
            <div className="floors">
                {floors.map((floor) => (
                    <Card
                        as="section"
                        variant="outlined"
                        key={floor.name}
                        className="floor"
                        aria-labelledby={"floor-" + floor.name}
                    >
                        <h2 id={"floor-" + floor.name} className="floor__title title-large">
                            {FLOOR_NAMES[floor.name] || floor.name}
                        </h2>
                        <div className="floor__body">
                            <div className="floor__plan">
                                <FloorPlan
                                    floor={floor}
                                    numbers={numbers}
                                    states={states}
                                    onSelect={showInList}
                                />
                            </div>
                            <ul className="floor__rooms">
                                {floor.rooms
                                    .filter((room) => room.seats > 0)
                                    .map((room) => (
                                        <RoomItem
                                            key={room._id}
                                            room={room}
                                            number={numbers[room._id]}
                                            state={states[room._id]}
                                            occupants={getOccupants(room, userInfo)}
                                            currentUser={currentUser}
                                            onShotgun={(event) => {
                                                createShotgunFunction(event, room._id);
                                                setSheet({ roomId: room._id, startedHere: true });
                                            }}
                                            onOpen={() =>
                                                setSheet({ roomId: room._id, startedHere: false })
                                            }
                                        />
                                    ))}
                            </ul>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="shotgun-bar" role="region" aria-label="Résumé du shotgun">
                <p className="shotgun-bar__item">
                    <span className="title-medium">{freeBeds}</span>{" "}
                    <span className="body-medium">
                        {freeBeds > 1 ? "lits libres" : "lit libre"}
                    </span>
                </p>
                <p className="shotgun-bar__item body-medium">
                    {myRoom ? (
                        <>
                            <Icon
                                name={states[myRoom._id] === "mine" ? "checkCircle" : "schedule"}
                            />
                            <span>
                                {myRoom.name}
                                {states[myRoom._id] === "pendingMine" &&
                                    myRoom.preShotgunExpiry && (
                                        <>
                                            {" · "}
                                            <PreShotgunTimer
                                                expiry={myRoom.preShotgunExpiry}
                                                label="il te reste"
                                            />
                                        </>
                                    )}
                            </span>
                        </>
                    ) : (
                        "Pas encore de chambre"
                    )}
                </p>
                {myRoom && states[myRoom._id] === "pendingMine" && (
                    <Button onClick={() => setSheet({ roomId: myRoom._id, startedHere: false })}>
                        Finaliser
                    </Button>
                )}
            </div>

            {sheetRoom && (
                <ShotgunSheet
                    key={sheetRoom._id}
                    room={sheetRoom}
                    state={states[sheetRoom._id]}
                    startedHere={sheet.startedHere}
                    occupants={getOccupants(sheetRoom, userInfo)}
                    currentUser={currentUser}
                    availablePersons={availablePersons}
                    isOwner={sheetRoom.user === currentUser._id}
                    onSubmitBeds={(roommatesIds) =>
                        addPersonsInShotgunFunction(sheetRoom._id, roommatesIds)
                    }
                    onCancel={() => cancelShotgunFunction(sheetRoom._id)}
                    onClose={() => setSheet(null)}
                />
            )}
        </>
    );
};

export default ShotgunBoard;
