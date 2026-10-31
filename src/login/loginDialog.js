// Opens the login dialog of the top app bar from anywhere (e.g. a page only for connected users)
let listener = null;

export const setLoginDialogListener = (fct) => {
    listener = fct;
};

export const openLoginDialog = () => {
    if (listener) listener(true);
};
