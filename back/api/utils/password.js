let bcrypt = require('bcrypt');

exports.cryptPassword = (password) => {
    return bcrypt.hash(password, 10)
};

exports.comparePassword = (pass, hash) => {
    return bcrypt.compare(pass, hash)
};
