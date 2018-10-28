let mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    rollback = require("./rollbackController"),
    userError = require("../../user/userErrors"),
    errors = require("../../utils/errors"),
    async = require('async');


// Shotgun all users
exports.shotgunUsers = (shotgun, userOwner, updateRoommates, roomId, callback) => {

    console.log("Shotgun all users  ...");

    let stackUpdateUsers = [];

    // Create tasks for checking and updating the users
    // update the user Owner
    let updateUserOwner = (callback) => {

        User.findOne({email: userOwner.email}, (err, user) => {
            if (err) return callback(err);
            if (!user)
                return callback(userError.getUserNotFoFundError("email", userOwner.email));

            // check that only the user owner can update his room
            if (!(String(user._id) === String(shotgun.user))) {
                console.error("-> User " + user.username + " doesn't own the shotgun. Can't update the shotgun.");
                let error = new Error("User " + user.username + " doesn't own the shotgun. Update forbidden");
                error.name = "Error 403 : Forbidden";
                error.httpStatusCode = "403";
                return callback(error);
            }

            // check that user hasn't already shotgun
            if (user.hasShotgun) {
                console.error("-> User " + user.username + " has already shotgun");
                let error = new Error('User ' + user.username + ' has already shotgun.');
                error.name = "Error 409 : Conflict";
                error.httpStatusCode = "409";
                return callback(error);
            }

            user.hasShotgun = true;
            user.room = roomId;

            user.save()
                .then(user => {
                    console.log("User " + user.username + " has shotgun.");
                    callback();
                }).catch(err => {
                    console.error("-> User " + user.username + " could not be udpated.");
                    return callback(errors.getServerError("Couldn't save " + user.username));
            });
        })
    };

    // update the roommates
    updateRoommates.forEach(
        (item) => {
            let updateRoommate = (callback) => {
                console.log("Trying to update user:" + item)
                User.findById(item, (err, user) => {
                    if (err) return callback(err);
                    console.log(item)
                    if (!user)
                        return callback(userError.getUserNotFoundError("id", item));

                    // check that user hasn't already shotgun
                    if (user.hasShotgun) {
                        console.error("-> User " + user.username + " has already shotgun");
                        let error = new Error('User ' + user.username + ' has already shotgun.');
                        error.name = "Error 409 : Conflict";
                        error.httpStatusCode = "409";
                        return callback(error);
                    }

                    user.hasShotgun = true;
                    user.room = roomId;

                    user.save()
                        .then(user => {
                            console.log("User " + user.username + " has shotgun.");
                            callback(null, user._id);
                        }).catch((err) => {
                            console.error("-> User " + user.username + " could not be udpated.");
                            return callback(errors.getServerError("Couldn't save " + user.username));
                    });
                })
            };
            stackUpdateUsers.push(updateRoommate);
        });

    // can't use parallel tasks because if a user has shotgun, the remaining users will continue to shotgun while an error
    // would have been thrown and the roolback begun just after, leading to inconsistency.
    async.waterfall([
        updateUserOwner,
        (callback) => {
            async.series(stackUpdateUsers, callback);
        }
    ], (error, foundRoommatesId) => {
        if (error) {
            console.error("-> Error before shotgun users : " + error);
            // rolling back the users
            let updateUsers = updateRoommates;
            updateUsers.push(userOwner.email);
            rollback.rollBackUsers(updateUsers, roomId, (err) => {
                if (err) {
                    return callback(err);
                }
                let error = new Error("Error caused roll back of all users.");
                error.name = "Error 400 : Bad request";
                error.httpStatusCode = "400";
                return callback(error);
            });
        }
        else {
            console.log("... All users added successfully.");
            callback(null, foundRoommatesId);
        }
    })
};
