let getObjectNotFoundError = require("../utils/errors").getObjectNotFoundError;

let getUserNotFoundError = (param_name, id) => {
    return getObjectNotFoundError("User", param_name, id);
};

module.exports = {
    getUserNotFoundError: getUserNotFoundError
};
