let mongoose = require('mongoose'),
    User = mongoose.model('Users');

// checks user exists and hasn't shotgun or isn't the owner of another shotgun
exports.checkUserOK = (userEmail, callback) => {
    console.log("Check user OK...");

    User.findOne({email: userEmail})
        .then(foundUser => {
            // No results ... User doesn't exist
            if (!foundUser) {
                console.log("User not found");
                let error = new Error('No user with email ' + userEmail + ' found.');
                error.name = "Error 400 : Query parameter error";
                error.httpStatusCode = "400";
                return callback(error);
            }

            if (foundUser.hasShotgun || foundUser.hasPreShotgun) {
                let error = new Error('User ' + foundUser.username + ' has already shotgunned or owns a shotgun.');
                error.name = "Error 409 : Conflict";
                error.httpStatusCode = "409";
                return callback(error);
            }
            return callback(null, foundUser);

        }).catch(err => {
        return callback(err);
    })
};
