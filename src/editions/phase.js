import { useEffect, useState } from "react";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { EDITIONS_ENDPOINT } from "../shotgun/constants";
import { getCredentials, register, unregister } from "../login/store";
import { restoreSession } from "../login/session";

export const PHASES = ["teaser", "shotgun", "countdown", "live", "recap"];

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// The shotgun phase starts a bit before the opening and lasts the first rush
export const SHOTGUN_LEAD_MS = 1 * HOUR;
export const SHOTGUN_TAIL_MS = 6 * HOUR;
// The weekend: from friday to sunday night
export const WEEKEND_MS = 3 * DAY;

export const computePhase = (edition, now = Date.now()) => {
    if (!edition || !edition.shotgunDate || !edition.weekendDate) return "teaser";

    const shotgun = new Date(edition.shotgunDate).getTime();
    const weekend = new Date(edition.weekendDate).getTime();

    if (now < shotgun - SHOTGUN_LEAD_MS) return "teaser";
    if (now < shotgun + SHOTGUN_TAIL_MS && now < weekend) return "shotgun";
    if (now < weekend) return "countdown";
    if (now < weekend + WEEKEND_MS) return "live";
    return "recap";
};

// Fake dates around now, so that ?phase= previews always have something to count down to
export const previewEdition = (phase, year, now = Date.now()) => {
    const offsets = {
        teaser: { shotgun: 12 * DAY + 5 * HOUR, weekend: 33 * DAY },
        shotgun: { shotgun: 42 * 60 * 1000, weekend: 20 * DAY },
        countdown: { shotgun: -9 * DAY, weekend: 11 * DAY + 7 * HOUR },
        live: { shotgun: -20 * DAY, weekend: -(DAY + 3 * HOUR) },
        recap: { shotgun: -60 * DAY, weekend: -30 * DAY },
    }[phase];

    return {
        year,
        shotgunDate: new Date(now + offsets.shotgun).toISOString(),
        weekendDate: new Date(now + offsets.weekend).toISOString(),
        preview: true,
    };
};

let editionCache = { login: null, promise: null };

// The current edition is only served to logged in users
const fetchCurrentEdition = () => {
    const login = getCredentials().login;
    if (!login) return Promise.resolve(null);

    if (editionCache.login !== login || !editionCache.promise)
        editionCache = {
            login,
            promise: getCallApi(EDITIONS_ENDPOINT + "?current=true", true, false)
                .then((response) => (response.ok ? response.json() : null))
                .then((json) => (json && json.data) || null)
                .catch(() => {
                    editionCache = { login: null, promise: null };
                    return null;
                }),
        };

    return editionCache.promise;
};

/*
 * { status: "loading" | "ready", edition } with edition null when unknown (logged out, no
 * edition this year or API down): callers fall back on a teaser.
 */
export const useCurrentEdition = () => {
    const [state, setState] = useState({ status: "loading", edition: null });

    useEffect(() => {
        let alive = true;

        const load = () =>
            fetchCurrentEdition().then((edition) => {
                if (alive) setState({ status: "ready", edition });
            });

        const onCreds = () => load();

        restoreSession().then(load);
        register(onCreds);

        return () => {
            alive = false;
            unregister(onCreds);
        };
    }, []);

    return state;
};

// Re-renders every `period` ms, for the phase to change by itself
export const useNow = (period = 30000) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), period);
        return () => clearInterval(interval);
    }, [period]);

    return now;
};
