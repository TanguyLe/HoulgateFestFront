export const LOGIN_URL = "http://localhost:3000/login";
export const REGISTER_URL = "http://localhost:3000/users";
export const READ_USER_URL = "http://localhost:3000/users";

export const STYLED_TAB_INDEX_PREFIX = "styledTab";
export const TAB_LABELS = ["RUser", "Log In", "Sign Up", "My account"];

export const SIGN_UP_FORM_BLOCK_INDEX_PREFIX = "signUpFormBlock";

export const NAME = "username";
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
