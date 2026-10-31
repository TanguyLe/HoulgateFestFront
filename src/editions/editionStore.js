import { EDITIONS_ENDPOINT } from "../shotgun/constants";
import { getCallApi } from "../utils/api/fetchMiddleware";
import { TIME_URL } from "../utils/miscFcts";
import { getCredentials, isSessionChecked, register } from "../login/store";
import { getTheme } from "./themes";

// The current edition, shared by the layout (edition colors) and the homepage (phase).
// The API only gives it to logged in users: until then, the latest theme is shown.

let state = {
    status: "idle", // idle | loading | loaded | failed
    edition: null,
    // server time minus client time, so the countdowns don't depend on the client's clock
    clockOffset: 0,
    login: "",
};
let listeners = [];

const setState = (next) => {
    state = Object.assign({}, state, next);
    listeners.forEach((listener) => listener(state));
};

export const getEditionState = () => state;

export const subscribeEdition = (listener) => {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter((other) => other !== listener);
    };
};

export const getEditionTheme = (edition = state.edition) => getTheme(edition && edition.year);

// Silent, unlike getParisDatetimeFromAPI: the homepage must render even without a backend
const fetchClockOffset = () =>
    fetch(TIME_URL)
        .then((response) => response.json())
        .then((json) => (typeof json.timestamp === "number" ? json.timestamp - Date.now() : 0))
        .catch(() => 0);

const load = (login) => {
    setState({ status: "loading", login: login });

    let request;
    try {
        request = getCallApi(EDITIONS_ENDPOINT + "?current=true", true, false);
    } catch {
        request = Promise.reject();
    }

    Promise.all([
        request.then((response) => {
            if (!response.ok) throw Error(response.status);
            return response.json();
        }),
        fetchClockOffset(),
    ])
        .then(([json, clockOffset]) => {
            if (state.login !== login) return;
            setState({ status: "loaded", edition: json.data || null, clockOffset: clockOffset });
        })
        .catch(() => {
            if (state.login !== login) return;
            setState({ status: "failed", edition: null });
        });
};

const onCredentials = (creds) => {
    if (creds.login === state.login && state.status !== "idle") return;

    if (creds.login) load(creds.login);
    else setState({ status: "idle", edition: null, login: "" });
};

// Called by the components needing the edition: loads it once the session has been checked
export const ensureEdition = () => {
    const creds = getCredentials();
    if (creds.login && isSessionChecked() && state.status === "idle") load(creds.login);
};

register(onCredentials);
