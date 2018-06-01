#! /usr/bin/env node

console.log('This script populates some test objects to the database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}



let async = require('async')
let Room = require('./api/room/roomModel')
let User = require('./api/user/userModel')
let passwordUtils = require("./api/utils/password"),
    userActivator = require("./api/user/userActivator");

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
var users = []

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

function userCreate(username, email, password, activated, cb) {
  passwordUtils.cryptPassword(password).then((resPassword) => {

    let user = new User({ username: username, email: email, password: resPassword, activated: activated });
       
    user.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New User: ' + user);
      users.push(user)
      cb(null, user);
    });
  }); 
}

function createUsers(cb) {
    async.parallel([
        function(callback) {
          userCreate('Patrick', 'Rothfuss@rothfuss.je', '1973-06-06', true, callback);
        },
        function(callback) {
          userCreate('Ben', 'Bova@bova.je', '1932-11-8',true, callback);
        },
        function(callback) {
          userCreate('Isaac', 'Asimov@asimov.je', '1920-01-02',true, callback);
        },
        function(callback) {
          userCreate('Bob', 'Billings@billings.je', '1920-01-02',true, callback);
        },
        function(callback) {
          userCreate('Jim', 'Jones@jones.je', '1971-12-16',true,  callback);
        },
        ],
        // optional callback
        cb);
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
    createRooms,
    createUsers
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ROOM: '+ rooms);
        console.log('USERS: '+ users);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




