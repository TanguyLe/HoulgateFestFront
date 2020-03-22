// Shotgun model

let mongoose = require('mongoose');

let shotgunSchema = new mongoose.Schema(
    {
        status: {type: String, enum: ['preShotgunned', 'shotgunned'], required: true, default: 'preShotgunned'},
        room: {type: mongoose.Schema.Types.ObjectId, ref: 'Rooms', required: true},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
        roommates: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Shotguns', shotgunSchema);
