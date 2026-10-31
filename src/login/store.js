let credentials = {
    login: "",
    accessToken: "",
    refreshToken: "",
};

let loginStore = [];

// Becomes true at the first dispatch: the stored session has then been checked (or replaced)
let sessionChecked = false;

export const isSessionChecked = () => sessionChecked;

export const register = (fct) => {
    loginStore.push(fct);
};

export const unregister = (fct) => {
    let index = loginStore.indexOf(fct);

    if (index > -1) {
        loginStore.splice(index, 1);
    }
};

export const dispatch = () => {
    let creds = getCredentials();
    sessionChecked = true;

    loginStore.forEach((fct) => {
        fct(creds);
    });
};

export const logout = () => {
    login("", "", "");
    window.localStorage.setItem("session", false);
};

export const silentLogin = (username, accessToken, refreshToken) => {
    credentials.login = username;
    credentials.accessToken = accessToken;
    credentials.refreshToken = refreshToken;

    window.localStorage.setItem("username", username);
    window.localStorage.setItem("accessToken", accessToken);
    window.localStorage.setItem("refreshToken", refreshToken);
    window.localStorage.setItem("session", true);
};

export const login = (username, accessToken, refreshToken) => {
    silentLogin(username, accessToken, refreshToken);

    dispatch();
};

export const getCredentials = () => {
    return credentials;
};
