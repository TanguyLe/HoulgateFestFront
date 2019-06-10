#! /usr/bin/env node

let scriptUtils = require("./scriptUtils");
console.log("This script cleans the db of test users and shotguns.");


let async = require("async");
let User = require("../api/user/userModel");
let Shotgun = require("../api/shotgun/shotgunModel");

let mongoose = require("mongoose");
let mongoDB = scriptUtils.getMongoDbFromArgs();

mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoose.connect(mongoDB);

let deleteShotguns = (cb) => {
    Shotgun.remove({}, (err) => {
            if (err) {
                cb(err, null);
                return
            }
            console.log("Shotguns deleted.");
            cb(null);
        }
    );
};

let removeTestUsers = (cb) => {
    let toDeleteUsernames = scriptUtils.testUsers.map((user) => user[0]);
    User.remove({username: {$in: toDeleteUsernames}}, (err) => {
        if (err) {
            cb(err, null);
            return
        }
        console.log("Test users " + toDeleteUsernames + " have been deleted if present.");
        cb(null);
    });
};

let removeShotgunStatuses = (cb) => {
    User.update({}, {$set: {"hasShotgun": false, "hasPreShotgun": false}}, {"upsert": false, "multi": true}, (err) => {
        if (err) {
            cb(err, null);
            return
        }
        console.log("Shotgun statuses reset.");
        cb(null);
    })
};

async.series([deleteShotguns, removeTestUsers, removeShotgunStatuses],
    (err) => {
        if (err) {
            console.log("FINAL ERR: " + err);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });
