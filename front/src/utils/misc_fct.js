import {POST, GET} from "./constants";


export const upCaseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const genParams = (method, body) => {
    return (body ? {
        method: method,
        body: JSON.stringify(body),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    } : {
        method: method,
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

};
export const genPostParams = (body) => genParams(POST, body);
export const genGetParams = () => genParams(GET, "");
