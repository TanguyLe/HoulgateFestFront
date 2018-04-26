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
    type: {type:String, required: true, default: 'users'},
    has_shotgun: {type: Boolean, default: false},
    is_shotgun: {type: Boolean, default: false},
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Rooms'},
});

module.exports = mongoose.model('Users', UserSchema);
