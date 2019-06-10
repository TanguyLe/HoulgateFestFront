let mongoose = require('mongoose'),
    Room = mongoose.model('Rooms'),
    Shotgun = mongoose.model('Shotguns'),
    User = mongoose.model('Users'),
    userErrors = require("../../user/userErrors"),
    shotgunComplete = require("./shotgunCompleteController"),
    async = require('async');

// Save shotgun in DB
exports.savePreShotgun = (userId, room, callback) => {
    console.log("Saving shotgun...");
    let roomId = room._id;
    const shotgun = new Shotgun({room: roomId, user: userId});

    async.waterfall([
        // Save in DB
        (callback) => {
            shotgun.save()
                .then(shotgun => {
                    console.log("...preShotgun saved.");
                    callback(null, shotgun);
                }).catch((err) => {
                return callback(err);
            })
        },
        // Update the user owner of the shotgun
        (shotgun, callback) => {
            console.log("Update owner user...");

            // complete first the shotgun if only one bed in the room (room full with user owner)
            if (String(room.nbBeds) === "1") {
                shotgunComplete.completeShotgun(roomId, null, (err, shotgun) => {
                    if (err) return callback(err);

                    User.findByIdAndUpdate(shotgun.user,
                        {
                            hasShotgun: true,
                            hasPreShotgun: true,
                            room: roomId
                        }, {new: true}, (err, foundUser) => {
                            if (err) return callback(err);

                            if (!foundUser)
                                return callback(userErrors("id", shotgun.user));

                            console.log("...User " + foundUser.username + " is updated.");
                            callback(null, shotgun);
                        })
                })
            }
            else {
                User.findByIdAndUpdate(shotgun.user,
                    {
                        hasPreShotgun: true,
                        room: roomId
                    }, {new: true}, (err, foundUser) => {
                        if (err) return callback(err);

                        if (!foundUser)
                            return callback(userErrors("id", shotgun.user));

                        console.log("...User " + foundUser.username + " is updated.");
                        callback(null, shotgun);
                    })
            }
        },
        // retrieve the full shotgun
        (shotgun, callback) => {
            Shotgun.findById(shotgun._id, {__v: 0}).populate('room', {__v: 0}).populate('user', {
                password: 0,
                __v: 0
            }).exec((err, foundShotgun) => {
                if (err) return callback(err);
                callback(null, foundShotgun);
            });
        }
    ], (err, shotgun) => {
        if (err) callback(err);
        callback(null, shotgun);
    })
};
