export const LOGIN_URL = "http://localhost:3000/login";
export const REGISTER_URL = "http://localhost:3000/users";
export const READ_USER_URL = "http://localhost:3000/users";

export const STYLED_TAB_INDEX_PREFIX = "styledTab";
export const TAB_LABELS = ["RUser", "Log In", "Sign Up"];

export const SIGN_UP_FORM_BLOCK_INDEX_PREFIX = "signUpFormBlock";

export const NAME = "username";
export const TYPE = "type";
export const ERROR_MSG = "errorMsg";
export const LABEL = "label";

export const TEXT = "text";

const USERNAME = "username";
const EMAIL = "email";
const PASSWORD = "password";
const CONFIRM = "confirm";

const EMAIL_FR = "email";
const USERNAME_FR = "nom d'utilisateur";
const PASSWORD_FR = "mot de passe";
const CONFIRM_FR = "confirmation mot de passe";

export const ERROR_MSG_INDEX_PREFIX = "ErrorMsg";
export const REGISTRATION_ERROR_MSG_PREFIX = "registration" + ERROR_MSG_INDEX_PREFIX;

const INVALID_EMAIL = "L'adresse email doit être valide.";
const INVALID_CONFIRM = "Les deux mots de passe doivent être identiques.";

export const SIGN_UP_DEF = [
    {[NAME]: EMAIL, [LABEL]: EMAIL_FR, [TYPE]: TEXT, [ERROR_MSG]: INVALID_EMAIL},
    {[NAME]: USERNAME, [LABEL]: USERNAME_FR, [TYPE]: TEXT},
    {[NAME]: PASSWORD, [LABEL]: PASSWORD_FR, [TYPE]: PASSWORD},
    {[NAME]: CONFIRM, [LABEL]: CONFIRM_FR, [TYPE]: PASSWORD, [ERROR_MSG]: INVALID_CONFIRM}
];

export const REGEXES = {
    email: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
};
