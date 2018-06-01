let mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    rollback = require("./rollbackController"),
    async = require('async');


// Shotgun all users
exports.shotgunUsers = (shotgun, userOwner, updateRoommates, roomId, callback) => {

    console.log("Shotgun all users  ...");

    let stackUpdateUsers = [];

    // Create tasks for checking and updating the users
    // Update the user Owner
    let updateUserOwner = function (callback) {

        User.findOne({ email: userOwner.email }, function (err, user) {
            if (err) return callback(err);
            if (!user) {
                console.error("-> User with email " + userOwner.email + " not found");
                let error = new Error('User with email ' + userOwner.email + ' not found.');
                error.name = "Error 404 : Not found";
                error.httpStatusCode = "404";
                return callback(error);
            }

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
                    console.error("-> User " + user.username + " could not be udpated.")
                    let error = new Error("Couldn't save " + user.username);
                    error.name = "Error 500 : Internal Server Error";
                    error.httpStatusCode = "500";
                    return callback(error);
                });
        })
    }

    // Update the roommates
    updateRoommates.forEach(
        function (item) {
            let updateRoommate = function (callback) {
                User.findOne({ email: item }, function (err, user) {
                    if (err) return callback(err);
                    if (!user) {
                        console.error("-> User with email " + item + " not found");
                        let error = new Error('User with email ' + item + ' not found.');
                        error.name = "Error 404 : Not found";
                        error.httpStatusCode = "404";
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
                            callback(null, user._id);
                        }).catch(err => {
                            console.error("-> User " + user.username + " could not be udpated.")
                            let error = new Error("Couldn't save " + user.username);
                            error.name = "Error 500 : Internal Server Error";
                            error.httpStatusCode = "500";
                            return callback(error);
                        });
                })
            }
            stackUpdateUsers.push(updateRoommate);
        });

    // can't use parallel tasks because if a user has shotgun, the remaining users will continue to shotgun while an error
    // would have been thrown and the roolback begun just after, leading to inconsistency.
    async.waterfall([
        updateUserOwner,
        function (callback) {
            async.series(stackUpdateUsers, callback);
        }
    ], function (error, foundRoommatesId) {
        if (error) {
            console.error("-> Error before shotgun users : " + error);
            // rolling back the users
            let updateUsers = updateRoommates;
            updateUsers.push(userOwner.email);
            rollback.rollBackUsers(updateUsers, roomId, function (err) {
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
            console.log("... All users added successfully.")
            callback(null, foundRoommatesId);
        }
    })
}