import { getCallApi, postCallApi, putCallApi, deleteCallApi } from "../utils/api/fetchMiddleware";
import { UNKNOWN_ERROR_MSG } from "../labels";
import { ME_URL } from "./constants";

// Resolves with the `data` of the answer, or rejects with the message sent by the back
const handleResponse = (response) =>
    response
        .json()
        .catch(() => ({}))
        .then((json) => {
            if (!response.ok) throw Error(json.message || UNKNOWN_ERROR_MSG);
            return json.data !== undefined ? json.data : json;
        });

export const adminGet = (url) => getCallApi(url, true, false).then(handleResponse);
export const adminPost = (url, body) => postCallApi(url, body, true, false).then(handleResponse);
export const adminPut = (url, body) => putCallApi(url, body, true, false).then(handleResponse);
export const adminDelete = (url) => deleteCallApi(url, undefined, true, false).then(handleResponse);

export const getMe = () => adminGet(ME_URL);

// <input type="date"> and <input type="datetime-local"> work in local time, the API in UTC
const toLocalIso = (date) => {
    const _date = new Date(date);
    return new Date(_date - _date.getTimezoneOffset() * 60000).toISOString();
};
export const toDateInput = (date) => (date ? toLocalIso(date).slice(0, 10) : "");
export const toDatetimeInput = (date) => (date ? toLocalIso(date).slice(0, 16) : "");
export const fromDateInput = (value) => (value ? new Date(value + "T00:00").toISOString() : null);
export const fromDatetimeInput = (value) => (value ? new Date(value).toISOString() : null);
