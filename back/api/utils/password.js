let bcrypt = require("bcrypt");

exports.cryptPassword = (plainTextPassword) => {
    return bcrypt.hash(plainTextPassword, 10)
};

exports.comparePassword = (plainTextPassword, hash) => {
    return bcrypt.compare(plainTextPassword, hash)
};

exports.cryptPasswordSync = (plainTextPassword) => {
    return bcrypt.hashSync(plainTextPassword, 10)
};

exports.comparePasswordSync = (plainTextPassword, hash) => {
    return bcrypt.compareSync(plainTextPassword, hash)
};
