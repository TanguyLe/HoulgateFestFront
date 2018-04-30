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
    hasShotgun: {type: Boolean, default: false},
    isShotgun: {type: Boolean, default: false},
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Rooms'},
});

module.exports = mongoose.model('Users', UserSchema);
