// Opens the login dialog from anywhere (menu, homepage, pages reserved to logged in users)
let listeners = [];

export const openLoginDialog = () => listeners.forEach((listener) => listener(true));
export const closeLoginDialog = () => listeners.forEach((listener) => listener(false));

export const onLoginDialog = (listener) => {
    listeners.push(listener);
    return () => (listeners = listeners.filter((other) => other !== listener));
};
