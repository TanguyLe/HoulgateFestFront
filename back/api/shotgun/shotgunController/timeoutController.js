let mongoose = require("mongoose"),
    Shotgun = mongoose.model("Shotguns"),
    User = mongoose.model("Users"),
    shotgunComplete = require("./shotgunCompleteController"),
    shotgunErrors = require("../shotgunErrors"),
    errors = require("../../utils/errors"),
    async = require("async");

let tuttimer = {};

// Set a timeout of 5 min linked to a shotgun
exports.setTimeout = (shotgun) => {
    tuttimer[shotgun._id] = setTimeout(this.timeoutTriggered.bind(null, shotgun), 120000);
};

// Clear a timeout related to a shotgun
exports.clearTimeout = (shotgun) => {
    clearTimeout(tuttimer[shotgun._id]);
};

// Delete shotgun not completed after a timeout
exports.timeoutTriggered = (shotgun) => {
    console.log("Timeout triggered for shotgun on room " + shotgun.room._id);

    // check if shotgun exists and delete it if shotgun is not completed
    Shotgun.findById(shotgun._id, (err, shotgun) => {
        if (err) console.error(err);
        if (!shotgun) {
            console.log("...shotgun is NOT done after timeout. Nothing to be done.");
            return null;
        }
        if (shotgun.status !== "shotgunned") {
            console.log("Deleting Shotgun on room " + shotgun.room + "...");
            // delete shotgun
            let deleteShotgun = (shotgun, callback) => {
                Shotgun.findByIdAndRemove(shotgun._id, (err, deletedShotgun) => {
                    if (err) {
                        console.error("-> Shotgun deleting error.");
                        return callback(errors.getServerError("Shotgun with roomId " + shotgun.room + " could not be deleted."));
                    }
                    if (!deletedShotgun)
                        return callback(shotgunErrors .getShotgunNotFoundError(shotgun.room));

                    callback(null, deletedShotgun)
                });
            };

            // roll back the user owner
            let updateUserOwner = (shotgun, callback) => {
                // special tratment for user owner
                User.findByIdAndUpdate(shotgun.user, {hasShotgun: false, hasPreShotgun: false, room: null}, (err, user) => {
                    if (err) return callback(err);
                    console.log("User " + user.username + " rolled back.");
                    callback();
                })
            };

            async.parallel({
                delete: deleteShotgun.bind(null, shotgun),
                update: updateUserOwner.bind(null, shotgun)
            }, (err) => {
                if (err) {
                    console.error("-> Error while deleting from DB.");
                    return;
                }
                console.log("...shotgun on room " + shotgun.room + " deleted.")
            })
        }
        else {
            console.log("...shotgun is done after timeout.");
            shotgunComplete.afterCompleteShotgun(shotgun);
        }
    })
};
