import {getCredentials, login} from "./store";
import {REFRESH_LOGIN_URL, genPostParams} from "./constants";

export const refresh_login = (creds) => {
    let params = genPostParams(creds);

    return fetch(REFRESH_LOGIN_URL, params)
        .then((response) => {
            if (!response.ok)
                throw Error("Requête");
            return response;
        })
        .then((response) => response.json())
        .then((jsonData) => {
            login(jsonData.username, jsonData.api_token, jsonData.refresh_token);
            alert("Login successfull " + jsonData.username + " !");
        })
        .catch(error => alert(error))
};

export const secure_fetch = (request_url, params) => {
    let creds = getCredentials();

    if (!creds.login)
        throw Error("Vous n'êtes pas connecté");

    let secured_request_url = (request_url + "?api_token=" + creds.api_token);

    return fetch(secured_request_url, params).then((response) => {
        if (!response.ok && (response.status === 401))
            refresh_login(creds).then(() => secure_fetch(request_url, params));

        return response;
    });
};
