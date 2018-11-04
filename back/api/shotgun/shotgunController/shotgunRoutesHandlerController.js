let mongoose = require("mongoose"),
    Shotgun = mongoose.model("Shotguns"),
    User = mongoose.model("Users"),
    Room = mongoose.model("Rooms"),
    tokenUtils = require("../../utils/token"),
    shotgunComplete = require("./shotgunCompleteController"),
    userHelper = require("../../user/userController/userHelperController"),
    roomHelper = require("../../room/roomController/roomHelperController"),
    shotgunHelper = require("./shotgunHelperController"),
    saveShotgun = require("./shotgunSaveController"),
    shotgunUsers = require("./shotgunUsersController"),
    rollback = require("./rollbackController"),
    shotgunErrors = require("../shotgunErrors"),
    userErrors = require("../../user/userErrors"),
    errors = require("../../utils/errors"),
    timeout = require("./timeoutController"),
    async = require("async");

// Handle Shotgun create on POST.
exports.shotgunCreatePost = (req, res) => {

    // Validate Request
    let user = undefined;
    let accessToken = tokenUtils.getJWTToken(req.headers);

    // check user is authenticated
    tokenUtils.checkAccessToken(
        accessToken,
        (err, decode) => {
            user = decode;
        },
        false
    );

    if (!user) {
        console.error("-> Shotgun create aborted. Invalid token.");
        return res
            .status(401)
            .json({message: "Authentication failed. Invalid accessToken."});
    }

    // check room query parameter
    if (!req.params.roomId) {
        console.error("-> Room query parameter is empty.");
        return res.status(400).send({
            meta: {
                error_type: "Error 400 : Query parameter error",
                code: "400",
                error_message: "Room query parameter can not be empty"
            }
        });
    }

    // check roomId is an ObjectId
    if (!req.params.roomId.match(/^[0-9a-fA-F]{24}$/)) {
        console.error("-> Room query parameter not ObjectID.");
        return res.status(400).send({
            meta: {
                error_type: "Error 400 : Query parameter error",
                code: "400",
                error_message: "RoomID not an Object ID (Cast Error)"
            }
        });
    }

    // Create shotgun
    async.waterfall([
        (callback) => {
            async.parallel([
                // check that user exists and hasn't already shotgun
                (callback) => {
                    userHelper.checkUserOK(user.email, (err, user) => {
                        if (err) {
                            console.error("-> Error check user.");
                            return callback(err);
                        }
                        console.log("... User OK.");
                        callback(null, user._id);
                    });
                },
                //Check room exists, has space available (minimum 1 place for the owner) and not already associated to a shotgun
                (callback) => {
                    async.parallel([
                        (callback) => {
                            roomHelper.checkRoomReadyForShotgun(req.params.roomId, 1, (err, room) => {
                                if (err) return callback(err);
                                callback(null, room);
                            });
                        },
                        (callback) => {
                            shotgunHelper.checkRoomNotShotgun(req.params.roomId, (err) => {
                                if (err) {
                                    console.error("-> Error check room not shotgun.");
                                    return callback(err);
                                }
                                callback();
                            });
                        }
                    ], callback);
                }

            ], (err, results) => {
                if (err) {
                    console.error("-> Error before saving to DB.");
                    return callback(err);
                }
                console.log("... Room OK.");
                callback(null, results); // results contains the owner userId and the room
            })
        }, (results, callback) => {
            // Save shotgun in DB
            saveShotgun.savePreShotgun(results[0], results[1][0], (err, shotgun) => {
                if (err) {
                    console.error("-> Shotgun saving error.");
                    return callback(err);
                }
                callback(null, shotgun);
            })
        }
    ], (err, shotgun) => {
        if (err) {
            return res.status(err.httpStatusCode || "500").send({
                meta: {
                    error_type: err.name,
                    code: err.httpStatusCode || "500",
                    error_message: err.message || "Some error occurred while creating the Shotgun."
                }
            });
        }
        console.log("... Shotgun is created.");

        // set a timeout that checks after a certain time if the created shotgun has been finalised in the meantime
        timeout.setTimeout(shotgun);

        return res.status(200).send({
            meta: {
                code: "200",
                desc: "Shotgun created successfully!"
            },
            data: shotgun
        });
    });
};

// Handle Shotgun delete.
exports.shotgunDelete = (req, res) => {

    // Validate Request
    let user = undefined;
    let accessToken = tokenUtils.getJWTToken(req.headers);

    // check user is authenticated
    tokenUtils.checkAccessToken(
        accessToken,
        (err, decode) => {
            user = decode;
        },
        false
    );

    if (!user) {
        console.error("-> Shotgun delete aborted. Invalid token.");
        return res
            .status(401)
            .json({message: "Authentication failed. Invalid accessToken."});
    }

    if (!req.params.roomId) {
        return res.status(400).send({
            meta: {
                error_type: "Error 400 : Query parameter error",
                code: "400",
                error_message: "RoomId query parameter can not be empty"
            }
        });
    }

    console.log("Deleting Shotgun...");
    async.waterfall([
        // find the shotgun
        (callback) => {
            console.log("Find shotgun...");
            console.log(req.params)
            // Find shotgun
            Shotgun.findOne({room: req.params.roomId}, (err, shotgun) => {
                if (err) return callback(err);
                if (!shotgun)
                    return callback(shotgunErrors.getShotgunNotFoundError(req.params.roomId));

                console.log("... Shotgun found.");
                callback(null, shotgun);
            })
        },
        // check user owner
        (shotgun, callback) => {
            console.log("Check user owner...");
            User.findOne({email: user.email}, (err, user) => {
                if (err) return callback(err);
                if (!user)
                    return callback(userErrors.getUserNotFoundError("email", user.email));

                // check that only the user owner can update his room
                if (!(String(user._id) === String(shotgun.user))) {
                    console.error("-> User " + user.username + " doesn't own the shotgun. Can't delete the shotgun.");
                    let error = new Error("User " + user.username + " doesn't own the shotgun. Delete forbidden");
                    error.name = "Error 403 : Forbidden";
                    error.httpStatusCode = "403";
                    return callback(error);
                }
                callback();
            })
        },
        // Delete shotgun
        (callback) => {
            Shotgun.findOneAndRemove({room: req.params.roomId}, (err, deletedShotgun) => {
                if (err) {
                    console.error("-> Shotgun deleting error.");
                    return callback(errors.getServerError("Shotgun with roomId " + req.params.roomId + " could not be deleted."));
                }
                if (!deletedShotgun)
                    return callback(shotgunErrors.getShotgunNotFoundError(req.params.roomId));
                console.log("... Shotgun successfully deleted.");
                timeout.clearTimeout(deletedShotgun); // remove timeout set when the shotgun was created
                callback(null, deletedShotgun);
            });
        },
        (shotgun, callback) => {
            // roll back the roommates
            let rollBackRoommates = (shotgun, callback) => {
                let users = shotgun.roommates;
                if (!users) {
                    console.log("No roommates to roll back.");
                    return callback()
                }
                rollback.rollBackUsers(users, shotgun.room, (err) => {
                    if (err) {
                        console.error("-> Error while rolling back the users.");
                        return callback(err);
                    }
                    callback();
                })
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
                rollBack: rollBackRoommates.bind(null, shotgun),
                update: updateUserOwner.bind(null, shotgun)
            }, callback)

        }], (err) => {
        if (err) {
            console.error("-> Error while deleting from DB.");
            return res.status(err.httpStatusCode || "500").send({
                meta: {
                    error_type: err.name,
                    code: err.httpStatusCode || "500",
                    error_message: err.message || "Some error occurred while deleting the Shotgun."
                }
            });
        }
        console.log("... Shotgun deleted.")
        res.send({
            meta: {
                code: "200",
                desc: "Shotgun deleted successfully!"
            }
        });
    })
};

// Display list of all shotguned rooms.
exports.roomList = (req, res) => {

    Shotgun.find({}, {__v: 0}).populate("room", {__v: 0}).exec((err, foundShotguns) => {
        if (err) {
            return res.status("500").send({
                meta: {
                    error_type: "Error 500 : Internal Server Error",
                    code: "500",
                    error_message: err.message || "Some error occurred while retrieving shotguns."
                }
            });
        }
        res.status(200).send({
            meta: {
                code: "200"
            },
            data: foundShotguns
        });
    });
};

// Handle roommates addition to shotgun on PUT.
exports.roommatesAdd = (req, res, next) => {
    // Validate Request
    let user = undefined;
    let accessToken = tokenUtils.getJWTToken(req.headers);

    // check user is authenticated
    tokenUtils.checkAccessToken(
        accessToken,
        (err, decode) => {
            user = decode;
        },
        false
    );

    if (!user) {
        console.error("-> Shotgun add roommates aborted. Invalid token.");
        return res
            .status(401)
            .json({message: "Authentication failed. Invalid accessToken."});
    }

    if (!req.body.roommates) {
        return res.status(400).send({
            meta: {
                error_type: "Error 400 : Query parameter error",
                code: "400",
                error_message: "Roommates query parameter can not be empty"
            }
        });
    }

    if (!req.params.roomId) {
        return res.status(400).send({
            meta: {
                error_type: "Error 400 : Query parameter error",
                code: "400",
                error_message: "RoomId query parameter can not be empty"
            }
        });
    }

    /* Add roommates */
    let updateUsers = req.body.roommates;

    async.waterfall([
        (callback) => {
            // find room and check that the number of users (roommates + user owner) isn"t exceeding the number of beds
            roomHelper.checkRoomReadyForShotgun(req.params.roomId, updateUsers.length + 1, callback);
        },
        (room, callback) => {
            // find the shotgun
            shotgunHelper.findShotgun(req.params.roomId, callback);
        },

        // Check and update the owner user and the roommates
        (shotgun, callback) => {
            // shotgun all users
            shotgunUsers.shotgunUsers(shotgun, user, updateUsers, req.params.roomId, callback);
        },
        // complete shotgun
        (roommatesId, callback) => {
            // Find shotgun and update it with the request query
            shotgunComplete.completeShotgun(req.params.roomId, roommatesId, callback)
        },
        // retrieve the complete shotgun and populate all its fields
        (shotgun, callback) => {
            Shotgun.findById(shotgun._id, {__v: 0}).populate("room", {__v: 0}).populate("user", {
                password: 0,
                __v: 0
            }).populate("roommates", {password: 0, __v: 0}).exec((err, populatedShotgun) => {
                if (err)
                    return callback(errors.getServerError("Couldn't populate shotgun " + shotgun._id + "."));
                callback(null, populatedShotgun);
            });
        }
    ], (err, shotgun) => {
        if (err) {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    meta: {
                        error_type: "Error 404 : Not found",
                        code: "404",
                        error_message: "Shotgun not found with id " + req.params.roomId
                    }
                });
            }
            else return res.status(err.httpStatusCode || "500").send({
                meta: {
                    error_type: err.name,
                    code: err.httpStatusCode || "500",
                    error_message: err.message || "Some error occurred while adding the roommates "
                }
            });
        }

        res.send({
            meta: {
                code: "200",
                desc: "Shotgun complete"
            },
            data: shotgun
        });
    })
};
