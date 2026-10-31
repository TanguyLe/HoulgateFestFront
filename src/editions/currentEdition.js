import { useEffect, useState } from "react";

import { EDITIONS_ENDPOINT } from "../shotgun/constants";
import { getCallApi } from "../utils/api/fetchMiddleware";
import { getCredentials, register, unregister } from "../login/store";

/*
 * The current edition ({ year, weekendDate, shotgunDate, ... }), shared by the whole site.
 * The API only answers to logged in users: logged out, the edition stays unknown (null).
 *
 * WhoAmI checks the stored session with this very call when the site loads, the other
 * components then reuse its answer instead of racing it (a refresh token can only be used once).
 */

const CURRENT_EDITION_URL = EDITIONS_ENDPOINT + "?current=true";

let editionPromise = null;
// The user the edition was requested for, to request it again for another one
let editionFor = null;
let listeners = [];

const notify = (edition) => listeners.forEach((listener) => listener(edition));

// Calls the API and returns the raw call: it rejects only when the login couldn't be refreshed
export const requestCurrentEdition = () => {
    const call = getCallApi(CURRENT_EDITION_URL, true, false);

    editionFor = getCredentials().login;
    editionPromise = call
        .then((response) => (response.ok ? response.json() : null))
        .then((json) => (json && json.data) || null)
        .catch(() => null);
    editionPromise.then(notify);

    return call;
};

// Resolves with the current edition, or null when it's unknown
export const getCurrentEdition = () => {
    const login = getCredentials().login;

    if (editionPromise && (!login || login === editionFor)) return editionPromise;
    if (!login) return Promise.resolve(null);

    requestCurrentEdition().catch(() => {});
    return editionPromise;
};

const onCurrentEdition = (listener) => {
    listeners.push(listener);
    return () => (listeners = listeners.filter((other) => other !== listener));
};

// React hook: { loading, edition }, requested again when someone logs in
export const useCurrentEdition = () => {
    const [state, setState] = useState({ loading: true, edition: null });

    useEffect(() => {
        let alive = true;
        const set = (edition) => alive && setState({ loading: false, edition });

        // The session check of WhoAmI may not have started yet: wait for its answer then
        const sessionPending =
            window.localStorage.getItem("session") === "true" &&
            !getCredentials().login &&
            !editionPromise;
        if (!sessionPending) getCurrentEdition().then(set);

        const stopListening = onCurrentEdition(set);
        const onLogin = (creds) => {
            if (creds.login) getCurrentEdition().then(set);
        };
        register(onLogin);

        // Without any answer after a while (failed session check...), stop waiting
        const timeout = setTimeout(
            () => alive && setState((current) => ({ ...current, loading: false })),
            4000,
        );

        return () => {
            alive = false;
            stopListening();
            unregister(onLogin);
            clearTimeout(timeout);
        };
    }, []);

    return state;
};
