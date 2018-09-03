#! /usr/bin/env node

console.log('This script populates initial necessart objects to the database. Specified database as argument - e.g.: initdb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}


let async = require('async');
let Room = require('./api/room/roomModel');

let babelCore = require('babel-core/register'),
    bableFill = require('babel-polyfill'),
    villaLesGenets = require("../front/src/shotgun/villaLesGenetsDef.js");

let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

let rooms = [];

function roomCreate(roomType, text, nbBeds, cb) {
    roomDetail = {
        roomType: roomType,
        text: text,
        nbBeds: nbBeds
    };

    let room = new Room(roomDetail);


    room.save((err) => {
            if (err) {
                cb(err, null);
                return
            }
            console.log('New Room: ' + room);
            rooms.push(room);
            cb(null, room);
        }
    );
}

function createRooms(cb) {
    let stackcreateRooms = [];

    villaLesGenets.villaLesGenets.floors.forEach(
        (floor) => {
            floor.rooms.forEach((room) => {
                    let createRoom = (callback) => {
                        roomCreate(room.type, room.name, room.seats, callback);
                    };
                    stackcreateRooms.push(createRoom);
                }
            )
        }
    );
    async.parallel(stackcreateRooms, cb);
}


async.series([
        createRooms
    ],
// Optional callback
    (err, results) => {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('ROOM: ' + rooms);

        }
        // All done, disconnect from database
        mongoose.connection.close();
    });
