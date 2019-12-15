let mongo = require('mongodb'),
    mongoose = require("mongoose"),
    nodemailer = require('nodemailer'),
    activator = require('activator'),
    User = mongoose.model("Users"),
    passwordUtils = require("../utils/password"),
    tokenUtils = require("../utils/token"),
    emailConfig = require('../mail/emailConfig');

exports.activator = activator;

exports.config = {
    user: {
        find: (id, callback) => {
            User.findById(id, (err, user) => {
                if (err) callback(err, null);

                else if (!user) callback(null, null);
                else {
                    let res = {id: user.id, email: user.email};

                    callback(null, res);
                }

            });
        },
        activate: (id, callback) => {
            User.updateOne({"_id": new mongo.ObjectId(id)}, {$set: {activated: true}}, callback);
        },
        setPassword: (id, password, callback) => {
            passwordUtils.cryptPassword(password).then((resPassword) => {
                User.updateOne({"_id": new mongo.ObjectId(id)}, {$set: {password: resPassword}}, callback);
            });
        },
    },
    emailProperty: "email",
    signkey: tokenUtils.secret,
    from: "houlgatefest@gmail.com",
    transport: nodemailer.createTransport(emailConfig.ACCOUNT_CONFIG),
    templates: activator.templates.file(__dirname + "/templates")
};
