let mongoose = require("mongoose"),
    User = mongoose.model("Users"),
    Shotgun = mongoose.model("Shotguns"),
    shotgunHelper = require("./shotgunHelperController"),
    async = require("async");
const errors = require("../../utils/errors");

let handleUserRollback = (item, callback) => {
    return (err, user) => {
        if (err) return callback(err);

        if (!user) {
            console.error("-> User with ID " + item + " not found. Not rolled back.");
            return callback();
        }
        if (user.hasShotgun) {
            if (String(roomId) === String(user.room)) {
                // the user has shotgun for the specified room, we free him
                user.hasShotgun = false;
                // don"t erase link to room if user owner
                if(!user.hasPreShotgun) user.room = null;

                user.save()
                    .then(user => {
                        console.log("User " + user.username + " rolled back.");
                        return callback(null, user._id);
                    }).catch(err => {
                    console.error("-> User " + user.username + " could not be udpated." + err);
                    return callback(errors.getServerError("Couldn't save " + user.username));
                });
            }
            else {
                console.log("User " + user.username + " has already shotgun another room. Not rolled back.");
                return callback(null, user._id);
            }
        }
        else {
            console.log("User " + user.username + " hasn't shotgun yet. Not rolled back.");
            return callback(null, user._id);
        }
    }
};

// Roll back all users that have shotgun the specified room
let rollBackUsers = (users, roomId, callback) => {
    console.log("Rolling back users..." + users);
    let stackUpdateUsers = [];
    let updateUser;

    users.forEach(
        (item) => {
            // depending on the data type representing the user (email or id), we call findById or findOne
            if (item instanceof mongoose.Types.ObjectId)
                updateUser = (callback) => User.findById(item, handleUserRollback(item, callback));
            else
                updateUser = (callback) => User.findOne({ email: item }, handleUserRollback(item, callback));
            stackUpdateUsers.push(updateUser);
        });

    async.parallel(stackUpdateUsers, (err, foundRoommatesId) => {
        if (err) {
            return callback(err);
        }
        console.log("... Users successfully rolled back.");
        return callback();
    })
};

// Roll back to shotgun created state
let rollBackShotgun = (roomId, callback) => {
    console.log("Rolling back shotgun...");

    async.waterfall([
        (callback) => {
            shotgunHelper.findShotgun(roomId, callback);
        },
        (shotgun, callback) => {
            let usersId = shotgun.roommates;
            usersId.push(shotgun.user);
            rollBackUsers(usersId, roomId, (err) => {
                if (err) {
                    console.error("-> Error while rolling back the users");
                    return callback(err);
                }
                callback(null, shotgun);
            }
            )
        },
        (shotgun, callback) => {
            Shotgun.findByIdAndUpdate(shotgun._id, {
                roommates: [],
                status: "preShotgunned"
            }, { new: true }, (err, shotgun) => {
                if (err) {
                    console.error("-> Error while rolling back the Shotgun.");
                    return callback(err);
                }
                return callback(null, shotgun);
            })
        }
    ], (err, shotgun) => {
        if (err) {
            console.error("-> Some errors occured while rolling back the shotgun.");
            return callback(err);
        }
        console.log("... Shotgun successfully rolled back.");
        callback(null, shotgun);
    })
};

module.exports = {
    rollBackShotgun: rollBackShotgun,
    rollBackUsers: rollBackUsers
};
