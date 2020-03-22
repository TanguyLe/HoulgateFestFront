#! /usr/bin/env node

let scriptUtils = require("./scriptsUtils");
console.log("This script retrieves all the confirmed shotgun from the database");

let async = require("async");
let fs = require("fs");

let mongoDB = scriptUtils.getMongoDbFromArgs();
let mongooseConnection = scriptUtils.connectToDb(mongoDB);

let Shotgun = require("../api/shotgun/shotgunModel");
let User = require("../api/user/userModel");

let retrieveShotguns = (cb) => {
    Shotgun.find({}, {__v: 0, _id: 0, createdAt: 0, updatedAt: 0}).populate("rooms", {
        __v: 0,
        _id: 0,
        createdAt: 0,
        updatedAt: 0
    }).populate("users", {
        password: 0,
        __v: 0,
        _id: 0,
        hasShotgun: 0,
        hasPreShotgun: 0,
        room: 0,
        activated: 0
    }).populate("roommates", {
        password: 0,
        __v: 0,
        _id: 0,
        hasShotgun: 0,
        hasPreShotgun: 0,
        room: 0,
        activated: 0
    }).exec((err, shotguns) => {
        if (err) {
            console.error(err);
            return cb(err);
        }
        console.log("-> Completed shotguns retrieved.");
        return cb(null, shotguns);
    });
};

let retrieveStandaloneUsers = (shotguns, cb) => {
    User.find({hasShotgun: false, activated: true}, {
        password: 0,
        __v: 0,
        _id: 0,
        hasPreShotgun: 0,
        room: 0,
        activated: 0
    }).exec((err, users) => {
            if (err) {
                console.error(err);
                return cb(err);
            }
            console.log("-> Standalone users retrieved.");
            return cb(null, shotguns, users);
        }
    );
};

let createRecapFile = (shotguns, users, cb) => {
    let text = "";

    if (shotguns.length)
        text += "This is the list of the completed shotgun(s) :\n" + shotguns;
    if (users.length)
        text += "\n\nThese users haven't shotgun yet:\n" + users;

    fs.writeFile("recapShotguns.txt", text, (err) => {
        if (err) {
            console.error(err);
            return cb(err);
        }
        console.log("-> Recap file saved!");
        return cb();
    });

};

async.waterfall([
        retrieveShotguns,
        retrieveStandaloneUsers,
        createRecapFile
    ],
    (err) => {
        if (err)
            console.log("FINAL ERR: " + err);
        else
            console.log("Recap file created at the current directory.");

        // All done, disconnect from database
        mongooseConnection.close();
    });
