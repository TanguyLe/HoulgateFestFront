#! /usr/bin/env node

let getMongoDbFromArgs = require("./scriptUtils").getMongoDbFromArgs;
console.log("This script populates the database with a few test users.");

let async = require("async");
let User = require("../api/user/userModel");
let passwordUtils = require("../api/utils/password");


let mongoose = require("mongoose");
let mongoDB = getMongoDbFromArgs();

mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoose.connect(mongoDB);


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
    async.parallel([
        (cb) => {createUser("Patrick", "Rothfuss@rothfuss.je", "1973-06-06", true, cb);},
        (cb) => {createUser("Ben", "Bova@bova.je", "1932-11-8", true, cb);},
        (cb) => {createUser("Isaac", "Asimov@asimov.je", "1920-01-02", true, cb);},
        (cb) => {createUser("Bob", "Billings@billings.je", "1920-01-02", true, cb);},
        (cb) => {createUser("Jim", "Jones@jones.je", "1971-12-16", true, cb);}
    ], callback);
};


async.series([createUsers],
    (err) => {
        if (err)
            console.log("FINAL ERR: " + err);

        // All done, disconnect from database
        mongoose.connection.close();
    });
