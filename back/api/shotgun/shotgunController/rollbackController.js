let mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Shotgun = mongoose.model('Shotguns'),
    shotgunHelper = require('./shotgunHelperController'),
    rollback = require('./rollbackController'),
    async = require('async');

// Roll back users to before shotgun state
exports.rollBackUsers = (users, roomId, callback) => {
    console.log("Rolling back users..." + users);
    let stackUpdateUsers = [];
    users.forEach(
        function (item) {
            // depending on the type of item we call findById or findOne
            if (item instanceof mongoose.Types.ObjectId) {
                var updateUser = function (callback) {
                    User.findById(item, function (err, user) {
                        if (err) return callback(err);

                        if (!user) {
                            console.error("-> User with ID " + item + " not found. Not rolled back.");
                            return callback();
                        }
                        if (user.hasShotgun) {
                            if (String(roomId) === String(user.room)) {
                                // the user has shotgun for the specified room, we free him
                                user.hasShotgun = false;
                                user.room = null;
                                user.save()
                                    .then(user => {
                                        console.log("User " + user.username + " rolled back.");
                                        return callback(null, user._id);
                                    }).catch(err => {
                                        console.error("-> User " + user.username + " could not be udpated." + err);
                                        let error = new Error("Couldn't save " + user.username);
                                        error.name = "Error 500 : Internal Server Error";
                                        error.httpStatusCode = "500";
                                        return callback(error);
                                    });
                            }
                            else {
                                console.log("User " + user.username + " has already shotgun another room. Not rolled back.");
                                return callback(null, user._id);
                            }
                        }
                        else {
                            console.log("User " + user.username + " hasn't shotgun yet. Not rolled back.")
                            return callback(null, user._id);
                        }
                    })
                }
            }
            else {
                var updateUser = function (callback) {
                    User.findOne({ email: item }, function (err, user) {
                        if (err) return callback(err);

                        if (!user) {
                            console.error("-> User " + item + " not found. Not rolled back.");
                            return callback();
                        }
                        if (user.hasShotgun) {
                            if (String(roomId) === String(user.room)) {
                                // the user has shotgun for the specified room, we free him
                                user.hasShotgun = false;
                                user.room = null;
                                // then
                                user.save()
                                    .then(user => {
                                        console.log("User " + user.username + " rolled back.");
                                        return callback(null, user._id);
                                    }).catch(err => {
                                        console.error("-> User " + user.username + " could not be udpated." + err);
                                        let error = new Error("Couldn't save " + user.username);
                                        error.name = "Error 500 : Internal Server Error";
                                        error.httpStatusCode = "500";
                                        return callback(error);
                                    });
                            }
                            else {
                                console.log("User " + user.username + " has already shotgun another room. Not rolled back.");
                                return callback(null, user._id);
                            }
                        }
                        else {
                            console.log("User " + user.username + " hasn't shotgun yet. Not rolled back.")
                            return callback(null, user._id);
                        }
                    })
                }
            }
            stackUpdateUsers.push(updateUser);
        });

    async.parallel(stackUpdateUsers, function (err, foundRoommatesId) {
        if (err) {
            return callback(err);
        }
        console.log("... Users successfully rolled back.");
        return callback();
    })
}

// Roll back to shotgun created state
exports.rollBackShotgun = (roomId, callback) => {
    console.log("Rolling back shotgun...");

    async.waterfall([
        function (callback) {
            shotgunHelper.findShotgun(roomId, callback);
        },
        function (shotgun, callback) {
            let usersId = shotgun.roommates;
            usersId.push(shotgun.user);
            rollback.rollBackUsers(usersId, roomId, function (err) {
                if (err) {
                    console.error("-> Error while rolling back the users");
                    return callback(err);
                }
                callback(null, shotgun);
            }
            )
        },
        function (shotgun, callback) {
            Shotgun.findByIdAndUpdate(shotgun._id, {
                roommates: [],
                status: 'created'
            }, { new: true }, function (err, shotgun) {
                if (err) {
                    console.error("-> Error while rolling back the Shotgun.");
                    return callback(err);
                }
                return callback(null, shotgun);
            })
        }
    ], function (err, shotgun) {
        if (err) {
            console.error("-> Some errors occured while rolling back the shotgun.");
            return callback(err);
        }
        console.log("... Shotgun successfully rolled back.");
        callback(null, shotgun);
    })
}