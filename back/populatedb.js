#! /usr/bin/env node

console.log('This script populates some test objects to the database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Room = require('./api/room/roomModel')
var User = require('./api/user/userModel')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var rooms = []
var users = []

function roomCreate(text, nbBeds, cb) {
  roomDetail = {
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

function userCreate(username, email, password, cb) {
  var user = new User({ username: username, email: email, password: password });
       
  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user);
  }   );
}

function createUsers(cb) {
    async.parallel([
        function(callback) {
          userCreate('Patrick', 'Rothfuss', '1973-06-06', callback);
        },
        function(callback) {
          userCreate('Ben', 'Bova', '1932-11-8', callback);
        },
        function(callback) {
          userCreate('Isaac', 'Asimov', '1920-01-02', callback);
        },
        function(callback) {
          userCreate('Bob', 'Billings', '1920-01-02', callback);
        },
        function(callback) {
          userCreate('Jim', 'Jones', '1971-12-16', callback);
        },
        ],
        // optional callback
        cb);
}


function createRooms(cb) {
    async.parallel([
        function(callback) {
          roomCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 1, callback);
        },
        function(callback) {
          roomCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 2,callback);
        },
        function(callback) {
          roomCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 3, callback);
        },
        function(callback) {
          roomCreate("Apes and Angels", 4, callback);
        }
        ],
        // optional callback
        cb);
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




