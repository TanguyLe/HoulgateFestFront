let credentials = {
    login: "",
    api_token: "",
    refresh_token: ""
};

let login_store = [];

export const register = (fct) => {
    login_store.push(fct)
};

export const unregister = (fct) => {
    let index = login_store.indexOf(fct);

    if (index > -1) {
        login_store.splice(index, 1);
    }
};

export const displatch = () => {
    let creds = getLogin();

    login_store.forEach((fct) => {
        fct(creds);
    })
};

export const setLogout = () => {
    setLogin("", "", "")
};

export const setLogin = (login, api_token, refresh_token) => {
    credentials.login = login;
    credentials.api_token = api_token;
    credentials.refresh_token = refresh_token;

    displatch();
};

export const getLogin = () => {
    return credentials
};
