import {UNKNOWN_ERROR_MSG} from "../labels"

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
    return fetch("https://worldtimeapi.org/api/timezone/Europe/Paris")
        .then((response) => response.json())
        .catch(error => alert(UNKNOWN_ERROR_MSG + error))
};
