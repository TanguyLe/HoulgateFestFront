import { UNKNOWN_ERROR_MSG } from "../labels";
import { SERVER_ENDPOINT } from "../constants";
import { notify } from "../ui/toast";

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

export const getParisDatetimeFromAPI = async () => {
    return fetch(TIME_URL)
        .then((response) => response.json())
        .then((json) => json.timestamp)
        .catch((error) => notify.error(UNKNOWN_ERROR_MSG + error));
};
