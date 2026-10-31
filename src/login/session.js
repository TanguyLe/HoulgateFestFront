import { useEffect, useState } from "react";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { EDITIONS_ENDPOINT } from "../shotgun/constants";
import { getMe } from "../admin/adminApi";
import { silentLogin, getCredentials, dispatch, logout, register, unregister } from "./store";

/*
 * Session helpers shared by every component showing the login state: the session saved in the
 * browser is checked once per page load (not once per component), and the admin flag is fetched
 * once per user.
 */

let restoring = null;

export const restoreSession = () => {
    if (!restoring)
        restoring = (async () => {
            if (window.localStorage.getItem("session") !== "true") return;

            const username = window.localStorage.getItem("username");
            const accessToken = window.localStorage.getItem("accessToken");
            const refreshToken = window.localStorage.getItem("refreshToken");

            // Let's check if we can get access the website
            silentLogin(username, accessToken, refreshToken);
            try {
                // This will try a regular call, and if needed a refresh login
                await getCallApi(EDITIONS_ENDPOINT + "?current=true", true, false);
                // Not login() with the tokens read above: a refresh during the call replaced them
                dispatch();
            } catch {
                // If we can't, it means the refresh token is invalid and we better logout
                logout();
            }
        })();

    return restoring;
};

const adminFlags = {};

// Only to show the admin link: the back checks the rights on every admin call
const getAdminFlag = (login) => {
    if (!adminFlags[login])
        adminFlags[login] = getMe()
            .then((me) => !!me.isAdmin)
            .catch(() => {
                delete adminFlags[login];
                return false;
            });

    return adminFlags[login];
};

export const useSession = () => {
    const [state, setState] = useState(() => ({
        login: getCredentials().login,
        isAdmin: false,
        ready: false,
    }));

    useEffect(() => {
        let alive = true;

        const onCreds = (creds) => {
            if (!alive) return;
            setState((previous) =>
                previous.login === creds.login && previous.ready
                    ? previous
                    : { login: creds.login, isAdmin: false, ready: true },
            );
            if (creds.login)
                getAdminFlag(creds.login).then((isAdmin) => {
                    if (alive && getCredentials().login === creds.login)
                        setState((previous) => ({ ...previous, isAdmin }));
                });
        };

        register(onCreds);
        restoreSession().then(() => onCreds(getCredentials()));

        return () => {
            alive = false;
            unregister(onCreds);
        };
    }, []);

    return state;
};

// The login dialog is hosted once by the layout, anything can ask it to open
const loginOpeners = new Set();

export const onLoginRequest = (fct) => {
    loginOpeners.add(fct);
    return () => loginOpeners.delete(fct);
};

export const openLogin = () => loginOpeners.forEach((fct) => fct());
