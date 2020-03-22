#! /usr/bin/env node


let scriptsUtils = require("./scriptsUtils");
console.log("This script populates initial necessary objects to the database.");


let async = require("async");
let Room = require("../api/room/roomModel");

let babelCore = require("babel-core/register"),
    bableFill = require("babel-polyfill"),
    villaLesGenets = require("./villaLesGenetsDef.js");

let mongoDB = scriptsUtils.getMongoDbFromArgs();
let mongooseConnection = scriptsUtils.connectToDb(mongoDB);

let createRoom = (roomType, text, nbBeds, cb) => {
    let roomDetail = {
        type: roomType,
        text: text,
        nbBeds: nbBeds
    };

    let room = new Room(roomDetail);

    room.save((err) => {
            if (err) {
                cb(err, null);
                return
            }
            console.log("New Room: " + room.text);
            cb(null);
        }
    );
};

let createRooms = (cb) => {
    let stackcreateRooms = [];

    villaLesGenets.villaLesGenets.floors.forEach(
        (floor) => {
            floor.rooms.forEach((room) =>
                    stackcreateRooms.push((callback) => createRoom(room.type, room.name, room.seats, callback))
            )
        }
    );
    async.parallel(stackcreateRooms, cb);
};


async.series([createRooms],
    (err) => {
        if (err) {
            console.log("FINAL ERR: " + err);
        }
        // All done, disconnect from database
        mongooseConnection.close();
    });
