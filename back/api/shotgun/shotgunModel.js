// Shotgun model

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let shotgunSchema = new Schema(
    {
        status: {type: String, enum: ['created', 'done'], required: true, default: 'created'},
        room: {type: Schema.Types.ObjectId, ref: 'Rooms', required: true},
        user: {type: Schema.Types.ObjectId, ref: 'Users', required: true},
        roommates: [{type: Schema.Types.ObjectId, ref: 'Users'}]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Shotguns', shotgunSchema);
