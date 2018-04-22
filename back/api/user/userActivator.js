let mongo = require('mongodb'),
    mongoose = require("mongoose"),
    nodemailer = require('nodemailer'),
    activator = require('activator'),
    User = mongoose.model("Users"),
    passwordUtils = require("../utils/password"),
    emailConfig = require('../utils/emailConfig');

exports.activator = activator;

exports.config = {
    user: {
        find: (id, callback) => {
            User.findById(id, (err, user) => {
                if (err) callback(err, null);
                // TODO Use that to do properly the check, and not the "before" hooks
                else if (!user) callback(null, null);
                else {
                    // TODO Put actual email
                    let res = {id: user.id, email: "houlgatefest@gmail.com"};

                    // TODO Check if passwordResetTime is of any use
                    if (user.activationCode)
                        res.activationCode = user.activationCode;
                    if (user.passwordResetCode)
                        res.passwordResetCode = user.passwordResetCode;
                    if (user.passwordResetTime)
                        res.passwordResetTime = user.passwordResetTime;

                    callback(null, res);
                }

            });
        },
        activate: (id, callback) => {
            let final_callback = (err, user) => {
                // TODO Handle Mongo Error case
                callback(null, user)
            };

            // TODO Generic Update by Id functions would be great
            // TODO And consequently a separation between controller level access, and mongo level queries
            User.update({"_id": new mongo.ObjectId(id)}, {$set: {activated: true}}, final_callback);
        },
        setPassword: (id, password, callback) => {
            let final_callback = (err, user) => {
                // TODO Handle Mongo Error case
                callback(null, user)
            };
            passwordUtils.cryptPassword(password).then((resPassword) => {
                User.update({"_id": new mongo.ObjectId(id)}, {$set: {password: resPassword}}, final_callback);
            });
        },
    },
    emailProperty: "email",
    // TODO Share it with the other part of the app, ultimately should be an env variable
    signkey: "whodoyouthinkyouarehackingme",
    from: "houlgatefest@gmail.com",
    transport: nodemailer.createTransport(emailConfig.ACCOUNT_CONFIG),
    templates: activator.templates.file(__dirname + "/templates")
};
