import { UNKNOWN_ERROR_MSG } from "../labels";
import { SERVER_ENDPOINT } from "../constants";

export const TIME_URL = SERVER_ENDPOINT + "/time/paris";

export const upCaseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const objectMap = (object, mapFn) => {
    return Object.keys(object).reduce((result, key) => {
        result[key] = mapFn(object[key]);
        return result;
    }, {});
};

// Simple function to parse a date string in format "DD/MM/YYYY HH:MM:SS"
export const parseFormattedDate = (dateString) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    const match = dateString.match(regex);

    if (match) {
        const [, day, month, year, hours, minutes, seconds] = match;
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    return new Date(dateString);
};

export const getParisDatetimeFromAPI = async () => {
    return fetch(TIME_URL)
        .then((response) => response.json())
        .then((json) => parseFormattedDate(json.time))
        .catch((error) => alert(UNKNOWN_ERROR_MSG + error));
};
