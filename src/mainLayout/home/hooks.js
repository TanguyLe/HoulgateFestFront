import { useEffect, useState } from "react";

import { getCredentials, register, unregister } from "../../login/store";
import { getCallApi } from "../../utils/api/fetchMiddleware";
import { USERS_ENDPOINT } from "../../constants";

// The current time, updated every `interval` ms
export const useNow = (interval = 1000) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), interval);
        return () => clearInterval(timer);
    }, [interval]);

    return now;
};

// The login of the connected user ("" when logged out)
export const useLogin = () => {
    const [login, setLogin] = useState(getCredentials().login);

    useEffect(() => {
        const onChange = (creds) => setLogin(creds.login);
        register(onChange);
        setLogin(getCredentials().login);
        return () => unregister(onChange);
    }, []);

    return login;
};

// The usernames of the people who already have a bed, null when unknown (logged out...)
export const useBookedPeople = (enabled) => {
    const [people, setPeople] = useState(null);

    useEffect(() => {
        if (!enabled) return setPeople(null);

        let alive = true;
        getCallApi(USERS_ENDPOINT, true, false)
            .then((response) => (response.ok ? response.json() : Promise.reject()))
            .then((json) => {
                if (!alive) return;
                const users = json.data || [];
                setPeople(
                    users.filter((user) => user.hasShotgun).map((user) => user.username || "?"),
                );
            })
            .catch(() => alive && setPeople(null));

        return () => {
            alive = false;
        };
    }, [enabled]);

    return people;
};
