let mongoose = require("mongoose"),
    Shotgun = mongoose.model("Shotguns"),
    deleteShotgun = require("./shotgunDeleteController"),
    rollback = require("./rollbackController"),
    shotgunErrors = require("../shotgunErrors"),
    shotgunNotification = require("../templates/shotgunNotification"),
    mail = require("../../mail/mailController"),
    errors = require("../../utils/errors"),
    async = require("async");

// Compelete the shotgun by
// adding the roommates and
// deleting all the shotguns own by the roommates to free the associated rooms
exports.completeShotgun = (roomId, roommatesId, callback) => {
    console.log("Completing shotgun...");
    Shotgun.findOneAndUpdate({room: roomId}, {
        roommates: roommatesId,
        status: "shotgunned"
    }, {new: true})
        .then(shotgun => {
            if (!shotgun)
                return callback(shotgunErrors.getShotgunNotFoundError(req.params.roomID));

            // delete all shotguns own by the roommates
            if (roommatesId && roommatesId.length > 0) {
                deleteShotgun.deleteShotguns(roommatesId, (err, result) => {
                    if (err) {
                        console.log("-> Shotgun not completed.");
                        return callback(err);
                    }
                    console.log("... Shotgun complete.");
                    callback(null, shotgun);
                })
            }
            else {
                console.log("... Shotgun complete.");
                callback(null, shotgun);
            }

        }).catch(err => {
        console.log("-> Shotgun not completed.");
        rollback.rollBackShotgun(roomId, (error) => {
            if (error) return callback(error);
            return callback(err);
        });
    })
};

// Handler after a complete shotgun
exports.afterCompleteShotgun = (shotgun) => {

    // retrieve the complete shotgun and populate the users" fields
    let retrieveShotgun = (shotgun, callback) => {
        Shotgun.findById(shotgun._id, {__v: 0}).populate("room", {__v: 0}).populate("user", {
            password: 0,
            __v: 0
        }).populate("roommates", {password: 0, __v: 0}).exec((err, populatedShotgun) => {
            if (err) {
                console.error("-> Couldn't populate shotgun " + shotgun._id + ".");
                return callback(errors.getServerError("Couldn't populate shotgun " + shotgun._id + "."));
            }
            callback(null, populatedShotgun);
        });
    };


    // create a shotgun recap mail to all users
    let sendMails = (populatedShotgun, callback) => {

        let userOwner = populatedShotgun.user;
        let users = populatedShotgun.roommates;
        users.push(userOwner);
        let room = populatedShotgun.room;

        let usersList = [];
        users.forEach(
            (item) => {
                usersList.push("<li>" + item.username + "</li>");
            }
        );

        let title = `Shotgun terminé !`;
        let content = shotgunNotification.getShotgunNotificationContent(userOwner.username, room.text, usersList);

        // send mail to all users
        let stackSendMail = [];
        users.forEach(
            (item) => {
                let mailContent = {
                    to: item.email, // this field also accepts the complete list of the users" email
                    subject: title,
                    text: content
                };
                let sendMail = (mailContent, callback) => {
                    mail.mailSender(mailContent, (err, sentMail) => {
                            if (err) {
                                console.error("-> Recap sending failed for user " + item.username + ".");
                                return callback(errors.getServerError("Couldn't send email to users after shotgun " + populatedShotgun._id + " completed."));
                            }
                            console.log("Recap mail sent to " + item.username);
                            return callback();
                        }
                    )
                };
                stackSendMail.push(sendMail.bind(null, mailContent));
            }
        );
        console.log("Sending recap emails to all users...");
        async.parallel(stackSendMail, callback);
    };

    async.waterfall([
        retrieveShotgun.bind(null, shotgun),
        sendMails
    ], (err, result) => {
        if (err) return console.error("-> After complete shotgun failed for shotgun with id:" + shotgun._id + ".");
        return console.log("...Recap sent to all users.");
    })
};
