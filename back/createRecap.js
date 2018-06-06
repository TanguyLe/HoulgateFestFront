#! /usr/bin/env node

console.log('This script retrieves all the confirmed shotgun from the database. Specified database as argument - e.g.: createRecap mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let async = require('async')
var fs = require('fs');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

let Shotgun = require('./api/shotgun/shotgunModel');
let Room = require('./api/room/roomModel');
let User = require('./api/user/userModel');

function retrieveShotguns(cb) {

    Shotgun.find({}, { __v: 0, _id: 0, createdAt: 0, updatedAt: 0 }).
        populate('room', { __v: 0, _id: 0, createdAt: 0, updatedAt: 0 }).
        populate('user', { password: 0, __v: 0, _id: 0, hasShotgun: 0, isShotgun: 0, room: 0, activated: 0 }).
        populate('roommates', { password: 0, __v: 0, _id: 0, hasShotgun: 0, isShotgun: 0, room: 0, activated: 0 }).
        exec(function (err, shotguns) {
            if (err) {
                console.error(err);
                let error = new Error("Couldn't retrieve the shotguns.");
                error.name = "Error 500 : Internal Server error";
                error.httpStatusCode = "500";
                return cb(error);
            }
            console.log("-> Completed Shotguns retrieved.")
            return cb(null, shotguns);
        });
}

function retrieveStandaloneUsers(shotguns, cb){
    User.find({hasShotgun: false, activated: true}, { password: 0, __v: 0, _id: 0, isShotgun: 0, room: 0, activated: 0 }).
        exec((err, users) => {
            if(err){
                console.error(err);
                return cb(err);
            }
            console.log("-> Standalone users retrieved.")
            return cb(null, shotguns, users);
        }
    );
}

function createRecapFile(shotguns,users, cb){
  
  fs.writeFile("/tmp/HoulgateFestRecap", "This is the list of the completed shotgun(s) :\n" + shotguns + "\n\nThese users haven't shotgun yet:\n" + users, function(err) {
      if(err) {
          console.error(err);
          return cb(err);
      }
      console.log("-> Recap file saved!");
    return cb();
  }); 

}

async.waterfall([
    retrieveShotguns,
    retrieveStandaloneUsers,
    createRecapFile
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else console.log("Recap file created at /tmp.");
    // All done, disconnect from database
    mongoose.connection.close();
});


