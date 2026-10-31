// Lets any component (e.g. a page only accessible once connected) open the login dialog
let listeners = [];

export const subscribeLoginPanel = (listener) => {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter((other) => other !== listener);
    };
};

export const openLoginPanel = () => listeners.forEach((listener) => listener(true));

export const closeLoginPanel = () => listeners.forEach((listener) => listener(false));
