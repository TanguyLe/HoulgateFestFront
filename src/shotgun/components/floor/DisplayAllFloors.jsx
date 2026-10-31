import React from "react";

import Floor, { getBookableRooms } from "./index";
import {
    FLOOR_GRID_STRUCT_INDEX_PREFIX,
    PRESHOTGUN_TIMEOUT_MS,
    ROOM_STATUS_READY,
} from "../../constants";
import { PageHead } from "../../../ui";

const LEGEND = [
    { tone: "free", label: "Libre" },
    { tone: "pending", label: "Shotgun en cours" },
    { tone: "taken", label: "Pris" },
    { tone: "mine", label: "À toi" },
];

class DisplayAllFloors extends React.Component {
    render() {
        const rooms = this.props.floors.flatMap(getBookableRooms);
        const seats = rooms.reduce((total, room) => total + room.seats, 0);
        const freeSeats = rooms
            .filter((room) => room.status === ROOM_STATUS_READY)
            .reduce((total, room) => total + room.seats, 0);

        return (
            <div className="shotgun">
                <PageHead
                    kicker="Villa Les Genêts"
                    title="Shotgun"
                    marquee={["Shotgun", freeSeats + " places libres", "Shotgun", "Bonne chance"]}
                >
                    Clique sur une chambre libre pour la shotgun, puis choisis qui dort avec toi. Tu
                    as {PRESHOTGUN_TIMEOUT_MS / 60000} minutes pour finaliser.
                </PageHead>
                <div className="shotgun__summary">
                    <p className="shotgun__stat">
                        <span className="shotgun__stat-value display">{freeSeats}</span>
                        <span className="label">/ {seats} places libres</span>
                    </p>
                    <ul className="legend" aria-label="Légende">
                        {LEGEND.map((item) => (
                            <li
                                key={item.tone}
                                className={"legend__item legend__item--" + item.tone}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="allFloors">
                    {this.props.floors.map((floor, index) => {
                        return (
                            <Floor
                                key={FLOOR_GRID_STRUCT_INDEX_PREFIX + index}
                                index={index}
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
            </div>
        );
    }
}

export default DisplayAllFloors;
