import {SERVER_ENDPOINT} from "../constants";

export const ROOM_GRID_STRUCT_INDEX_PREFIX = "RoomGridStruct";
export const FLOOR_GRID_STRUCT_INDEX_PREFIX = "FloorGridStruct";
export const ROOM_SEATS_DISPLAY_INDEX_PREFIX = "RoomSeatsDisplay";

export const ROOM_STATUS_SHOTGUNNED = "shotgunned";
export const ROOM_STATUS_LOADING = "loading";
export const ROOM_STATUS_PRESHOTGUNNED = "preShotgunned";
export const ROOM_STATUS_READY = "readyForShotgun";

export const PASSING_TYPE = "passing";
export const BATHROOM_TYPE = "bathroom";
export const KITCHEN_TYPE = "kitchen";
export const RESTROOMS_TYPE = "restrooms";
export const BEDROOM_TYPE = "bedroom";
export const STAIRS_TYPE = "stairs";
export const LIVING_ROOM_TYPE = "livingRoom";
export const GARDEN_TYPE = "garden";

export const shotgunDate = "June 07, 2018 20:00:00";

export const ROOMS_ENDPOINT = SERVER_ENDPOINT + "/rooms";
export const SHOTGUN_ROOMS_ENDPOINT = SERVER_ENDPOINT + "/shotgun/rooms";
export const getShotgunRoomUrl = (roomId) =>  (SHOTGUN_ROOMS_ENDPOINT + '/' + roomId);
