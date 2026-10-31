import {
    ROOM_STATUS_LOADING,
    ROOM_STATUS_PRESHOTGUNNED,
    ROOM_STATUS_SHOTGUNNED,
} from "./constants";

// What a room is for the connected user. Each state has a colour role in shotgun.css and a label
// with an icon, so it never relies on the colour alone.
export const STATES = {
    free: { label: "Libre", icon: "bed" },
    locked: { label: "Libre", icon: "lock" },
    loading: { label: "Chargement", icon: "hourglassTop" },
    pending: { label: "En cours", icon: "schedule" },
    pendingMine: { label: "À finaliser", icon: "schedule" },
    mine: { label: "Ta chambre", icon: "checkCircle" },
    taken: { label: "Prise", icon: "group" },
};

// The connected user, from the users list of the API
export const findCurrentUser = (userInfo, username) =>
    Object.values(userInfo).find((user) => user.username === username);

/**
 * The state of a room for the user:
 * 1) shotgunned: by the user (or with them) => mine, by others => taken
 * 2) pre-shotgunned: by the user => pendingMine, by someone else => pending
 * 3) loading
 * 4) ready (empty): locked if the user already has a room or a pre-shotgun, else free
 */
export const getRoomState = (room, currentUser) => {
    const shotgunOnGoingForUser = currentUser.hasPreShotgun || currentUser.hasShotgun;
    const isUserRoom = shotgunOnGoingForUser ? room._id === currentUser.room : false;

    if (room.status === ROOM_STATUS_SHOTGUNNED) return isUserRoom ? "mine" : "taken";
    if (room.status === ROOM_STATUS_PRESHOTGUNNED) return isUserRoom ? "pendingMine" : "pending";
    if (room.status === ROOM_STATUS_LOADING) return "loading";
    return shotgunOnGoingForUser ? "locked" : "free";
};

// The names of the people in a room: its owner first, then the roommates
export const getOccupants = (room, userInfo) =>
    [room.user, ...(room.roommates || [])]
        .filter(Boolean)
        .map((userId) => (userInfo[userId] ? userInfo[userId].username : "?"));
