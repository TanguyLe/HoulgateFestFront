#! /usr/bin/env node

let scriptsUtils = require("./scriptsUtils");

console.log("This script populates the database with a few test users.");

let async = require("async");
let User = require("../api/user/userModel");
let passwordUtils = require("../api/utils/password");

let mongoDB = scriptsUtils.getMongoDbFromArgs();
let mongooseConnection = scriptsUtils.connectToDb(mongoDB);

let createUser = (username, email, password, activated, cb) => {
    let user = new User({
        username: username,
        email: email,
        password: passwordUtils.cryptPasswordSync(password),
        activated: activated
    });

    user.save((err) => {
        if (err) {cb(err); return;}
        console.log("New User: " + user.username);
        cb(null);
    });
};

let createUsers = (callback) => {
    async.parallel(scriptsUtils.testUsers.map((user, index) => ((cb) => createUser(...user, cb))), callback);
};


async.series([createUsers],
    (err) => {
        if (err)
            console.log("FINAL ERR: " + err);

        // All done, disconnect from database
        mongooseConnection.close();
    });
