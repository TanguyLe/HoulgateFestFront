import {
    ROOM_STATUS_LOADING,
    ROOM_STATUS_SHOTGUNNED,
    ROOM_STATUS_PRESHOTGUNNED,
    ROOM_STATUS_READY,
} from "./constants";

/**
 * What a room means for the current user, shared by the floor plan and the room list:
 * - `state`: colour of the room (`data-state`, see pages.css)
 * - `label`: its status in words
 * - `action`: what clicking it does, null when there's nothing to do
 * - `dialog`: the step the room dialog shows ("attributingBeds" or "shotgunSuccessful")
 *
 * 1) Shotgunned: by the user => "mine", opens the confirmation. Else "taken", inert
 * 2) Pre-shotgunned: by the user => "pending-mine", opens the beds attribution. Else "pending"
 * 3) Loading => "loading", inert
 * 4) Ready (empty): the user already has a room => "locked", inert. Else "available", shotguns it
 */
export const getRoomState = (room, me) => {
    const hasRoom = Boolean(me && (me.hasPreShotgun || me.hasShotgun));
    const isMine = hasRoom && room._id === me.room;

    switch (room.status) {
        case ROOM_STATUS_SHOTGUNNED:
            return isMine
                ? {
                      state: "mine",
                      label: "Ta chambre",
                      action: "Voir",
                      dialog: "shotgunSuccessful",
                  }
                : { state: "taken", label: "Prise", action: null };
        case ROOM_STATUS_PRESHOTGUNNED:
            return isMine
                ? {
                      state: "pending-mine",
                      label: "À finaliser",
                      action: "Finaliser",
                      dialog: "attributingBeds",
                  }
                : { state: "pending", label: "En cours", action: null };
        case ROOM_STATUS_LOADING:
            return { state: "loading", label: "Un instant…", action: null };
        case ROOM_STATUS_READY:
        default:
            return hasRoom
                ? { state: "locked", label: "Libre", action: null }
                : { state: "available", label: "Libre", action: "Shotgun" };
    }
};

// Bedrooms are the rooms with seats, the others are only drawn on the plan
export const isBedroom = (room) => room.seats > 0;
