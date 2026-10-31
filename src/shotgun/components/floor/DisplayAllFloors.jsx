import React from "react";

import Floor from "./index";
import {
    FLOOR_GRID_STRUCT_INDEX_PREFIX,
    ROOM_STATUS_PRESHOTGUNNED,
    ROOM_STATUS_SHOTGUNNED,
} from "../../constants";
import { getCredentials } from "../../../login/store";
import { Icon } from "../../../ui";

const LEGEND = [
    ["free", "Libre"],
    ["pending", "Pré-shotgun en cours"],
    ["taken", "Complet"],
    ["mine", "Ta chambre"],
];

// Beds left and the current user's room, for the summary above the floors
const getSummary = (floors, userInfo) => {
    const rooms = floors.flatMap((floor) => floor.rooms).filter((room) => room && room.seats > 0);
    const currentUser = Object.values(userInfo).find(
        (user) => user.username === getCredentials().login,
    );

    let freeSeats = 0;
    let totalSeats = 0;
    rooms.forEach((room) => {
        totalSeats += room.seats;
        if (room.status !== ROOM_STATUS_SHOTGUNNED && room.status !== ROOM_STATUS_PRESHOTGUNNED)
            freeSeats += room.seats;
    });

    const myRoom =
        currentUser && (currentUser.hasShotgun || currentUser.hasPreShotgun)
            ? rooms.find((room) => room._id === currentUser.room)
            : null;

    return { freeSeats, totalSeats, myRoom, hasShotgun: currentUser && currentUser.hasShotgun };
};

class DisplayAllFloors extends React.Component {
    render() {
        const { freeSeats, totalSeats, myRoom, hasShotgun } = getSummary(
            this.props.floors,
            this.props.userInfo,
        );

        return (
            <div className="allFloors">
                <header className="shotgun-head">
                    <div>
                        <span className="kicker">Villa Les Genêts</span>
                        <h1 className="shotgun-head__title">Shotgun des chambres</h1>
                    </div>
                    <div className="shotgun-head__stats">
                        <span className="stat">
                            <strong>{freeSeats}</strong>
                            <span>places libres</span>
                        </span>
                        <span className="stat">
                            <strong>{totalSeats}</strong>
                            <span>places en tout</span>
                        </span>
                    </div>
                </header>

                {myRoom ? (
                    <p className={"shotgun-mine" + (hasShotgun ? " shotgun-mine--done" : "")}>
                        <Icon name={hasShotgun ? "sparkle" : "clock"} />
                        {hasShotgun ? (
                            <span>
                                Ton lit t’attend dans <b>{myRoom.name}</b>. Réjouis-toi !
                            </span>
                        ) : (
                            <span>
                                Tu as pré-shotgun <b>{myRoom.name}</b> : finalise vite ton shotgun !
                            </span>
                        )}
                    </p>
                ) : (
                    <p className="shotgun-hint">
                        <Icon name="info" />
                        <span>
                            Choisis une chambre, appuie sur <b>Shotgun!</b> puis indique qui dort
                            avec toi. Tu as 2 minutes pour finaliser.
                        </span>
                    </p>
                )}

                <ul className="legend" aria-label="Légende">
                    {LEGEND.map(([tone, label]) => (
                        <li key={tone} className={"legend__item tone-" + tone}>
                            <span className="legend__dot" aria-hidden="true" />
                            {label}
                        </li>
                    ))}
                </ul>

                {this.props.floors.map((floor, index) => {
                    return (
                        <Floor
                            key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index}
                            floorData={floor}
                            userInfo={this.props.userInfo}
                            createShotgunFunction={(event, room) =>
                                this.props.createShotgunFunction(event, room, floor)
                            }
                            addPersonsInShotgunFunction={this.props.addPersonsInShotgunFunction}
                            cancelShotgunFunction={this.props.cancelShotgunFunction}
                        />
                    );
                })}
            </div>
        );
    }
}

export default DisplayAllFloors;
