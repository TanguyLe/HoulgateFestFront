// Room model

let mongoose = require('mongoose');

var Schema = mongoose.Schema;

let roomSchema = new Schema(
    {
        type: {type:String, required: true, default: 'rooms'},
        roomType : {type:String, required: true, default: 'undefined'},
        text: {type: String},
        nbBeds: {type: Number, min: [0, 'No places'], required: true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Rooms', roomSchema);