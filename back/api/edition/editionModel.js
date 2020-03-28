// Editions model

let mongoose = require('mongoose');

let EditionSchema = new mongoose.Schema(
    {
        year: {type: mongoose.Schema.Types.Number, required: true, unique: "This year is already in the database."},
        weekendDate: {type: mongoose.Schema.Types.Date, required: true},
        shotgunDate: {type: mongoose.Schema.Types.Date, required: true}
    }
);

module.exports = mongoose.model('Edition', EditionSchema);
