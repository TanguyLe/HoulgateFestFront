#! /usr/bin/env node

let scriptUtils = require("./scriptsUtils");
console.log("This script cleans the db of test users and shotguns.");


let async = require("async");
let User = require("../api/user/userModel");
let Shotgun = require("../api/shotgun/shotgunModel");

let mongoDB = scriptUtils.getMongoDbFromArgs();
let mongooseConnection = scriptUtils.connectToDb(mongoDB);

let deleteShotguns = (cb) => {
    Shotgun.deleteMany({}, (err) => {
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
    User.deleteMany({username: {$in: toDeleteUsernames}}, (err) => {
        if (err) {
            cb(err, null);
            return
        }
        console.log("Test users " + toDeleteUsernames + " have been deleted if present.");
        cb(null);
    });
};

let removeShotgunStatuses = (cb) => {
    User.updateMany({}, {$set: {"hasShotgun": false, "hasPreShotgun": false}}, {
        "upsert": false,
        "multi": true
    }, (err) => {
        if (err) {
            cb(err, null);
            return
        }
        console.log("Shotgun statuses reset.");
        cb(null);
    })
};

const seriesWithUsers = [deleteShotguns, removeShotgunStatuses];
const seriesWithoutUsers =     [...seriesWithUsers, removeTestUsers];

let series = process.argv.slice(2)[1] === "keepUsers" ? seriesWithUsers : seriesWithoutUsers;

async.series(series,
    (err) => {
        if (err) {
            console.log("FINAL ERR: " + err);
        }
        // All done, disconnect from database
        mongooseConnection.close();
    });
