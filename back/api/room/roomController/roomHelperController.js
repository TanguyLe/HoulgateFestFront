let mongoose = require('mongoose'),
    Room = mongoose.model('Rooms');

// checks room exists
exports.checkRoomExists = (roomId, callback) => {
    console.log("Check room " + roomId + " exists...");

    Room.findById(roomId, function (err, foundRoom) {
        if (err) return callback(err);

        if (foundRoom) {
            console.log("... Room found.");
            return callback(null, foundRoom);
        }
        else {
            console.error("-> No room found.");
            let error = new Error('No room with id ' + roomId + ' found.');
            error.name = "Error 400 : Query parameter error";
            error.httpStatusCode = "400";
            return callback(error);

        }
    })
}

// checks that the room exists and has sufficient beds for the number of users 
exports.checkRoomReadyForShotgun = (roomId, usersNb, callback) => {
    console.log("Checking room ready for Shotgun...");
    
    Room.findById(roomId, function (err, room) {
        if (err) return callback(err);

        if (!room) {
            console.error("-> Room not found");
            let error = new Error('Room with id ' + roomId + ' not found.');
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error);
        }
        if (room.nbBeds < usersNb) {
            console.error("-> Not enough space in selected room");
            let error = new Error('Too many roommates for room with id ' + roomId + ' : not enough beds');
            error.name = "Error 403 : Forbidden";
            error.httpStatusCode = "403";
            return callback(error);
        }
        console.log("... Room ready.");
        callback(null, room);
    })
}

