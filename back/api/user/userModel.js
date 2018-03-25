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
    }
});

UserSchema.plugin(beautifyUnique, {
    defaultMessage: "{PATH} existe déjà"
});

module.exports = mongoose.model("Users", UserSchema);
