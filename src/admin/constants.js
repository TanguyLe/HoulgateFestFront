import { SERVER_ENDPOINT, USERS_ENDPOINT } from "../constants";

export const ME_URL = USERS_ENDPOINT + "/me";
export const ADMIN_USERS_URL = SERVER_ENDPOINT + "/admin/users";
export const ADMIN_EDITIONS_URL = SERVER_ENDPOINT + "/admin/editions";
export const getAdminUserUrl = (userId) => ADMIN_USERS_URL + "/" + userId;
export const getAdminActivationEmailUrl = (userId) => getAdminUserUrl(userId) + "/activationEmail";
export const getAdminEditionUrl = (editionId) => ADMIN_EDITIONS_URL + "/" + editionId;
export const ADMIN_SHOTGUNS_URL = SERVER_ENDPOINT + "/admin/shotguns";
export const ADMIN_HISTORIZE_URL = ADMIN_SHOTGUNS_URL + "/historize";
