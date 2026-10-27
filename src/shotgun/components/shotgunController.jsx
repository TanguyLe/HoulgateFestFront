import React from "react";

import DisplayAllFloors from "./floor/DisplayAllFloors";
import PreShotgunTimer from "./preShotgunTimer";
import { getParisDatetimeFromAPI, objectMap } from "../../utils/miscFcts";
import { villaLesGenets } from "../villaLesGenetsDef";
import { USERS_ENDPOINT } from "../../constants";
import {
    ROOMS_ENDPOINT,
    SHOTGUN_ROOMS_ENDPOINT,
    getShotgunRoomUrl,
    ROOM_STATUS_LOADING,
    ROOM_STATUS_SHOTGUNNED,
    ROOM_STATUS_PRESHOTGUNNED,
    ROOM_STATUS_READY,
    PRESHOTGUN_TIMEOUT_MS,
} from "../constants";

import {
    deleteCallApi,
    getCallApi,
    postCallApi,
    putCallApi,
} from "../../utils/api/fetchMiddleware";
import { getCredentials } from "../../login/store";
import { Alert } from "../../ui/components";
import { notify } from "../../ui/toast";

const INTERVAL_DURATION = 15000;

class ShotgunContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            villaLesGenets: {
                floors: villaLesGenets.floors.map((floor) => ({
                    ...floor,
                    rooms: floor.rooms.map((room) => ({ ...room, status: ROOM_STATUS_READY })),
                })),
            },
            loading: true,
            error: false,
            shotgunId: null,
            userInfo: {},
            roomsIndexed: {},
            // the room whose dialog is open, from its row or from the status bar
            openRoomId: null,
        };

        // Server time minus client time, so the pre-shotgun expiries don't depend on the client's clock
        this.clockOffset = 0;

        this.addPersonsInShotgun = this.addPersonsInShotgun.bind(this);
        this.cancelShotgun = this.cancelShotgun.bind(this);
        this.createShotgun = this.createShotgun.bind(this);
        this.intervalFunction = this.intervalFunction.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    getRoomUpdater(roomId, newRoom) {
        /**
         * Returns an updater for the roomsIndexed particularly to change one room.
         * It is an object to be used with the updateState method.
         */
        const currentRoom = this.state.roomsIndexed[roomId];
        return Object.assign({
            roomsIndexed: Object.assign(this.state.roomsIndexed, {
                [roomId]: Object.assign({}, currentRoom, newRoom),
            }),
        });
    }

    async getUsersUpdater() {
        /**
         * Returns an updater for the userInfo and eventually shotgunId.
         * It is an object up-to-date with the server to be used with the updateState method.
         */
        const usersApiCall = await getCallApi(USERS_ENDPOINT, true);
        const users = (await usersApiCall.json()).data;

        const currentUserUsername = getCredentials().login;

        const currentUser = users.find((user) => user.username === currentUserUsername);

        let userInfo = {};
        users.forEach((user) => (userInfo[user._id] = user));

        let res = { userInfo: userInfo };
        if (!currentUser.hasShotgun && !currentUser.hasPreShotgun) res.shotgunId = null;

        return res;
    }

    async getFloorsUpdater() {
        /**
         * Returns an updater for the roomsIndexed and status. The page is considered loaded when any of those is applied
         * to the state.
         * It is an object up-to-date with the server to be used with the updateState method.
         */
        const shotgunsApiCall = await getCallApi(SHOTGUN_ROOMS_ENDPOINT, true);
        const shotgunsList = (await shotgunsApiCall.json()).data;

        // Right now it doesn't seem straightforward, but getFloorsUpdater should be able to use getRoomUpdater a
        // way or another.
        const updateRoom = (room) => {
            let related_shotgun = shotgunsList.find((shotgun) => shotgun.room._id === room._id);
            if (!related_shotgun)
                return Object.assign({}, room, {
                    status: ROOM_STATUS_READY,
                    user: "",
                    preShotgunExpiry: null,
                });

            // The room's own createdAt overrides the shotgun's one below, so the expiry is computed first
            // and converted to the client's clock
            const preShotgunExpiry =
                related_shotgun.status === ROOM_STATUS_PRESHOTGUNNED
                    ? new Date(related_shotgun.createdAt).getTime() +
                      PRESHOTGUN_TIMEOUT_MS -
                      this.clockOffset
                    : null;
            return Object.assign({}, room, related_shotgun, related_shotgun.room, {
                preShotgunExpiry,
            });
        };

        return { roomsIndexed: objectMap(this.state.roomsIndexed, updateRoom), loading: false };
    }

    updateState(updaters, callback) {
        let nextState = {};

        updaters.forEach((val) => {
            nextState = Object.assign(nextState, val);
        });

        this.setState(nextState, callback);
    }

    shouldComponentUpdate(nextProps, nextState, _) {
        return (
            JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
            JSON.stringify(nextState) !== JSON.stringify(this.state)
        );
    }

    async intervalFunction(callback) {
        // Not in parallel: both may refresh the login, and a refresh token can only be used once
        const floorsUpdater = await this.getFloorsUpdater();
        const usersUpdater = await this.getUsersUpdater();

        this.updateState([floorsUpdater, usersUpdater], callback);
    }

    async componentDidMount() {
        /**
         * Fetches the rooms' definition and the floors' definition, updates once with the eventual shotguns and
         * the user, and then start the time-outed refreshes.
         */
        const serverTimestamp = await getParisDatetimeFromAPI();
        if (typeof serverTimestamp === "number") this.clockOffset = serverTimestamp - Date.now();

        await getCallApi(ROOMS_ENDPOINT, true).then(async (response) => {
            if (response.status === 400) this.setState({ error: true, loading: false });
            else {
                const rooms = (await response.json()).data;

                const RoomFct = (room) => {
                    const roomName = room.name;

                    const roomId = rooms.find((room) => room.text === roomName)._id;
                    roomsIndexed[roomId] = Object.assign(roomsIndexed[roomId], room);

                    return roomId;
                };

                const floorFct = (floor) => {
                    return Object.assign(floor, { rooms: floor.rooms.map(RoomFct) });
                };

                let roomsIndexed = rooms.reduce((acc, room) => ({ ...acc, [room._id]: room }), {});

                this.updateState(
                    [
                        {
                            villaLesGenets: Object.assign(this.state.villaLesGenets, {
                                floors: this.state.villaLesGenets.floors.map(floorFct),
                            }),
                            roomsIndexed: roomsIndexed,
                        },
                    ],
                    () =>
                        this.intervalFunction(() => {
                            this.refrechInterval = setInterval(
                                this.intervalFunction,
                                INTERVAL_DURATION,
                            );
                        }),
                );
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.refrechInterval);
    }

    async createShotgun(event, roomId) {
        ////////////////////////////////////////////////////////////////////////
        ////// set state as loading while waiting for query results ////////////
        ////////////////////////////////////////////////////////////////////////
        let roomUpdater = this.getRoomUpdater(roomId, { status: ROOM_STATUS_LOADING });

        this.updateState([roomUpdater], async () => {
            // Trying to shotgun it
            const shotgunServerUpdate = await postCallApi(
                getShotgunRoomUrl(roomId),
                { roomId: roomId },
                true,
            );

            if (shotgunServerUpdate.status === 200) {
                ////////////////////////////////////////////////////////////////////
                ////// preShotgunConfirmed /////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////

                const shotgunResult = await shotgunServerUpdate.json();
                const usersUpdater = await this.getUsersUpdater();

                roomUpdater = this.getRoomUpdater(roomId, { status: ROOM_STATUS_PRESHOTGUNNED });

                // And update the shotgunId, the users and the room
                this.updateState([
                    { shotgunId: shotgunResult.data._id },
                    usersUpdater,
                    roomUpdater,
                ]);
            } else {
                ////////////////////////////////////////////////////////////////////
                ////// preShotgun denied //////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////

                // The shotgun was denied, several possible reasons, may need to elaborate in the future.
                notify.error("Cette pièce n’est plus disponible, ou tu as déjà shotgun.");
            }
            await this.intervalFunction();
        });
    }

    async addPersonsInShotgun(roomId, roommatesIds = []) {
        const shotgunId = this.state.shotgunId;

        let roomUpdater = this.getRoomUpdater(roomId, { status: ROOM_STATUS_LOADING });

        this.updateState([roomUpdater], async () => {
            // Trying to complete the shotgun
            const addUserToShotgun = await putCallApi(
                getShotgunRoomUrl(roomId),
                { roomId: roomId, roommates: roommatesIds, shotgunId },
                true,
            );

            if (addUserToShotgun.status === 200) {
                const roomUpdater = this.getRoomUpdater(roomId, { status: ROOM_STATUS_SHOTGUNNED });
                const usersUpdater = await this.getUsersUpdater();

                // Updating the users and the room.
                this.updateState([usersUpdater, roomUpdater]);
            } else {
                // The shotgun was denied, several possible reasons, may need to elaborate in the future.
                notify.error(
                    "Trop tard ! Cette pièce est soit déjà shotgun, soit toi ou un de " +
                        "tes camarades est déjà inscrit dans une pièce.",
                );
            }
            await this.intervalFunction();
        });
    }

    async cancelShotgun(roomId) {
        let roomUpdater = this.getRoomUpdater(roomId, { status: ROOM_STATUS_LOADING });

        this.updateState([roomUpdater], async () => {
            // Deletes the shotgun, or the pre-shotgun, and frees the room and everyone in it
            const cancelShotgun = await deleteCallApi(getShotgunRoomUrl(roomId), {}, true);

            if (cancelShotgun.status === 200) this.updateState([{ shotgunId: null }]);
            else notify.error("L’annulation a échoué, recharge la page et réessaie.");

            await this.intervalFunction();
        });
    }

    getFloorsToRender() {
        const replaceRoom = (roomId) => {
            return this.state.roomsIndexed[roomId];
        };

        const replaceFloor = (floor) => {
            return Object.assign({}, floor, { rooms: floor.rooms.map(replaceRoom) });
        };

        return this.state.villaLesGenets.floors.map(replaceFloor);
    }

    getMe() {
        return Object.values(this.state.userInfo).find(
            (user) => user.username === getCredentials().login,
        );
    }

    // What the user has to do next, always in sight in the status bar
    renderMyStatus(me) {
        const room = me && me.room ? this.state.roomsIndexed[me.room] : null;

        if (!room || !(me.hasShotgun || me.hasPreShotgun))
            return (
                <div className="shotgun__me">
                    <strong>Pas encore de lit</strong>
                    <span>Choisis une chambre libre ci-dessous.</span>
                </div>
            );

        const pending = room.status === ROOM_STATUS_PRESHOTGUNNED;

        return (
            <div className="shotgun__me" data-state={pending ? "pending-mine" : "mine"}>
                <span className="shotgun__me-text">
                    <strong>
                        {pending ? "À finaliser" : "Ton lit"}
                        {pending && room.preShotgunExpiry ? (
                            <PreShotgunTimer expiry={room.preShotgunExpiry} label=" ·" />
                        ) : null}
                    </strong>
                    <span>{room.name || room.text}</span>
                </span>
                <button
                    type="button"
                    className={"btn btn--sm " + (pending ? "btn--primary" : "")}
                    onClick={() => this.setState({ openRoomId: room._id })}
                >
                    {pending ? (
                        <>
                            <span className="hide-sm">Attribuer les lits</span>
                            <span className="show-sm">Finaliser</span>
                        </>
                    ) : (
                        "Voir"
                    )}
                </button>
            </div>
        );
    }

    render() {
        if (this.state.loading) return <Alert loading>Chargement des chambres…</Alert>;

        if (this.state.error)
            return (
                <Alert tone="error" title="Erreur de chargement des chambres">
                    Tu n’aurais pas dû voir ça. Vérifie ta connexion internet et recharge la page.
                </Alert>
            );

        const me = this.getMe();
        const floors = this.getFloorsToRender();
        const freeSeats = floors.reduce(
            (total, floor) =>
                total +
                floor.rooms
                    .filter((room) => room.status === ROOM_STATUS_READY)
                    .reduce((sum, room) => sum + room.seats, 0),
            0,
        );

        return (
            <div className="shotgun">
                <div className="shotgun__bar">
                    <div className="shotgun__counter">
                        <span className="shotgun__counter-value">{freeSeats}</span>
                        <span>
                            lits libres
                            <small>actualisé toutes les {INTERVAL_DURATION / 1000} s</small>
                        </span>
                    </div>
                    {this.renderMyStatus(me)}
                </div>
                <DisplayAllFloors
                    floors={floors}
                    me={me}
                    userInfo={this.state.userInfo}
                    openRoomId={this.state.openRoomId}
                    onOpenRoom={(roomId) => this.setState({ openRoomId: roomId })}
                    createShotgunFunction={this.createShotgun}
                    addPersonsInShotgunFunction={this.addPersonsInShotgun}
                    cancelShotgunFunction={this.cancelShotgun}
                />
                <ul className="legend" aria-label="Légende du plan">
                    <li data-state="available">Libre</li>
                    <li data-state="pending">Shotgun en cours</li>
                    <li data-state="taken">Prise</li>
                    <li data-state="mine">À toi</li>
                </ul>
            </div>
        );
    }
}

export default ShotgunContainer;
