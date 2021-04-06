import { getCredentials, login } from "../../login/store";
import { REFRESH_LOGIN_URL } from "./constants";
import {
    genGetParams,
    genPostParams,
    genPutParams,
    genDeleteParams,
    getAuthUpdatedParams,
} from "./paramsFcts";
import { UNKNOWN_ERROR_MSG } from "../../labels";

export const refreshLogin = (alert = true) => {
    let creds = getCredentials();

    let params = genPostParams({ refreshToken: creds.refreshToken });

    let promise = fetch(REFRESH_LOGIN_URL, params)
        .then((response) => {
            if (!response.ok)
                throw Error(
                    "Erreur lors du refresh de ton login, " +
                        "essaie de recharger la page et de te déconnecter/reconnecter."
                );
            return response;
        })
        .then((response) => response.json())
        .then((jsonData) => {
            login(jsonData.username, jsonData.accessToken, jsonData.refreshToken);
        });

    if (alert) return promise.catch((error) => alert(UNKNOWN_ERROR_MSG + error));

    return promise;
};

export const autoRefreshFetch = (requestUrl, params, alert = true) => {
    return fetch(requestUrl, params).then((response) => {
        if (!response.ok && response.status === 401)
            return refreshLogin(alert)
                .then(() => {
                    params = getAuthUpdatedParams(params);
                })
                .then(() => fetch(requestUrl, params));
        else return response;
    });
};

export const getCallApi = (endpoint, auth = true, alert = true) => {
    if (auth) return autoRefreshFetch(endpoint, genGetParams(auth), alert);

    return fetch(endpoint, genGetParams(auth));
};

export const postCallApi = (endpoint, body, auth = true, alert = true) => {
    if (auth) return autoRefreshFetch(endpoint, genPostParams(body, auth), alert);

    return fetch(endpoint, genPostParams(body, auth));
};

export const putCallApi = (endpoint, body, auth = true, alert = true) => {
    if (auth) return autoRefreshFetch(endpoint, genPutParams(body, auth), alert);

    return fetch(endpoint, genPutParams(body, auth));
};

export const deleteCallApi = (endpoint, body, auth = true, alert = true) => {
    if (auth) return autoRefreshFetch(endpoint, genDeleteParams(body, auth), alert);

    return fetch(endpoint, genDeleteParams(body, auth));
};
