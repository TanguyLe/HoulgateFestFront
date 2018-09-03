#! /usr/bin/env node

console.log('This script populates initial necessart objects to the database. Specified database as argument - e.g.: initdb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}


let async = require('async')
let Room = require('./api/room/roomModel');

let babelCore = require('babel-core/register'),
    bableFill = require('babel-polyfill'),
    villaLesGenets = require("../front/src/shotgun/villaLesGenetsDef.js");

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var rooms = []

function roomCreate(roomType, text, nbBeds, cb) {
  roomDetail = {
    roomType: roomType,
    text: text, 
    nbBeds: nbBeds
  } 
  
  var room = new Room(roomDetail);

       
  room.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Room: ' + room);
    rooms.push(room)
    cb(null, room)
  }  );
}

function createRooms(cb) {
  let stackcreateRooms = []

  villaLesGenets.villaLesGenets.floors.forEach(
    function(floor){
      floor.rooms.forEach(
        function(room){
          let createRoom = function(callback) {
            roomCreate(room.type, room.name, room.seats, callback);
          }
          stackcreateRooms.push(createRoom);
        }
      )
    }
  )
  async.parallel(stackcreateRooms, cb);
}


async.series([
    createRooms
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ROOM: '+ rooms);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




