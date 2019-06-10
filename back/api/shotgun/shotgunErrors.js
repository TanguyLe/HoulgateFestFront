let getObjectNotFoundError = require("../utils/errors").getObjectNotFoundError;

let getShotgunNotFoundError = (id) => {
    return getObjectNotFoundError("Shotgun", "roomId", id);
};

module.exports = {
    getShotgunNotFoundError: getShotgunNotFoundError
};
