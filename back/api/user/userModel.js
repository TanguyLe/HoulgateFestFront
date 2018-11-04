let mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");


let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: "Un compte avec cet email existe déjà."
    },
    username: {
        type: String,
        unique: "Ce nom d'utilisateur n'est pas disponible."
    },
    password: {
        type: String,
        required: true
    },
    hasShotgun: {type: Boolean, default: false},
    hasPreShotgun: {type: Boolean, default: false},
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Rooms', default: null},
    activated: {
        type: Boolean,
        required: true,
        default: false
    }
});

UserSchema.plugin(beautifyUnique, {
    defaultMessage: "{PATH} existe déjà."
});

module.exports = mongoose.model("Users", UserSchema);
