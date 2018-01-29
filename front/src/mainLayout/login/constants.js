export const LOGIN_URL = "https://jsonplaceholder.typicode.com/users/3";
export const REFRESH_LOGIN_URL = "https://jsonplaceholder.typicode.com/users/20";

export const STYLED_TAB_INDEX_PREFIX = "styledTab";
export const TAB_LABELS = ["My account", "Log In", "Sign Up"];

export const SIGN_UP_FORM_BLOCK_INDEX_PREFIX = "signUpFormBlock";

export const NAME = "name";
export const TYPE = "type";

export const TEXT = "text";

const EMAIL = "email";
const PASSWORD = "password";
const CONFIRM = "confirm";
export const signUpDef = [
    {[NAME]: EMAIL, [TYPE]: TEXT},
    {[NAME]: NAME, [TYPE]: TEXT},
    {[NAME]: PASSWORD, [TYPE]: PASSWORD},
    {[NAME]: CONFIRM, [TYPE]: PASSWORD}
];
