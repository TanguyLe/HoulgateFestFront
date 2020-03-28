#! /usr/bin/env node

let scriptsUtils = require("./scriptsUtils");

console.log("This script populates the database with the editions.");

let async = require("async");
let Edition = require("../api/edition/editionModel");

let mongoDB = scriptsUtils.getMongoDbFromArgs();
let mongooseConnection = scriptsUtils.connectToDb(mongoDB);


let createEditions = (callback) => {
    async.parallel(
        [
            () => new Edition({year: 2018,
                weekendDate: (new Date(2018, 5, 8)),
                shotgunDate: (new Date(2018, 5, 7, 20))}).save(),
            () => new Edition({year: 2019,
                weekendDate: (new Date(2019, 5, 28)),
                shotgunDate: (new Date(2019, 5, 10, 20))}).save(),
            () => new Edition({year: 2020,
                weekendDate: (new Date(2020, 5, 26)),
                shotgunDate: (new Date(2020, 5, 12, 20))}).save(),
        ]
        , callback);
};


async.series([createEditions],
    (err) => {
        if (err)
            console.log("FINAL ERR: " + err);

        // All done, disconnect from database
        mongooseConnection.close();
    });
