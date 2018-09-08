let getObjectNotFoundError = require("../utils/errors").getObjectNotFoundError;

let getRoomNotFoundError = (id) => {
    return getObjectNotFoundError("Room", "id", id);
};

module.exports = {
    getRoomNotFoundError: getRoomNotFoundError
};
