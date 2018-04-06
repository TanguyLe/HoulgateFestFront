let credentials = {
    login: "",
    accessToken: "",
    refreshToken: ""
};

let loginStore = [];

export const register = (fct) => {
    loginStore.push(fct)
};

export const unregister = (fct) => {
    let index = loginStore.indexOf(fct);

    if (index > -1) {
        loginStore.splice(index, 1);
    }
};

export const displatch = () => {
    let creds = getCredentials();

    loginStore.forEach((fct) => {
        fct(creds);
    })
};

export const logout = () => {
    login("", "", "")
};

export const login = (login, accessToken, refreshToken) => {
    credentials.login = login;
    credentials.accessToken = accessToken;
    credentials.refreshToken = refreshToken;

    displatch();
};

export const getCredentials = () => {
    return credentials
};
