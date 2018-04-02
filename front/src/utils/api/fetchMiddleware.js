import {getCredentials, login} from "../../login/store";
import {REFRESH_LOGIN_URL} from "./constants";
import {genGetParams, genPostParams, getAuthUpdatedParams} from "./paramsFcts";

export const refreshLogin = () => {
    let creds = getCredentials();

    let params = genPostParams({refreshToken: creds.refreshToken});

    return fetch(REFRESH_LOGIN_URL, params)
        .then((response) => {
            if (!response.ok)
                throw Error("Requête");
            return response;
        })
        .then((response) => response.json())
        .then((jsonData) => {
            login(jsonData.username, jsonData.accessToken, jsonData.refreshToken);
        })
        .catch(error => alert("Erreur inattendue, veuillez vérifier l'état de votre connection internet. " + error))
};

export const autoRefreshFetch = (requestUrl, params) => {
    return fetch(requestUrl, params).then((response) => {
        if (!response.ok && (response.status === 401))
            return refreshLogin().then(() => {
                params = getAuthUpdatedParams(params)
            }).then(() => fetch(requestUrl, params));
        else
            return response;
    });
};

export const getCallApi = (endpoint, auth = true) => {
    if (auth)
        return autoRefreshFetch(endpoint, genGetParams(auth));

    return fetch(endpoint, genGetParams(auth))
};

export const postCallApi = (endpoint, body, auth = true) => {
    if (auth)
        return autoRefreshFetch(endpoint, genPostParams(body, auth));

    return fetch(endpoint, genPostParams(body, auth))
};
