let mongoose = require('mongoose');


let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Users', UserSchema);
