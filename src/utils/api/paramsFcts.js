import {POST, GET, PUT, DELETE} from "./constants";
import {getCredentials} from "../../login/store";


export const genParams = (method, body, auth = true) => {
    let header = {
        'Content-Type': 'application/json'
    };

    if (auth) {
        let creds = getCredentials();

        if (!creds.login)
            throw Error("Vous n'êtes pas connecté");

        header["authorization"] = "JWT " + creds.accessToken;
    }

    return (body ? {
        method: method,
        body: JSON.stringify(body),
        headers: new Headers(header)
    } : {
        method: method,
        headers: new Headers(header)
    })
};

export const getAuthUpdatedParams = (params) => {
    let creds = getCredentials();

    let header = {
        'Content-Type': 'application/json',
        "authorization": "JWT " + creds.accessToken
    };

    return Object.assign(params, {"headers": new Headers(header)})
};

export const genPostParams = (body, auth = true) => genParams(POST, body, auth);
export const genPutParams = (body, auth = true) => genParams(PUT, body, auth);
export const genGetParams = (auth = true) => genParams(GET, "", auth);
export const genDeleteParams = (auth = true) => genParams(DELETE, "", auth);
