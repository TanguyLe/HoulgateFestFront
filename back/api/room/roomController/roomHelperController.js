let mongoose = require('mongoose'),
    roomErrors = require("../roomErrors"),
    Room = mongoose.model('Rooms');

// Check room exists
exports.checkRoomExists = (roomId, callback) => {
    console.log("Check room " + roomId + " exists...");

    Room.findById(roomId, (err, foundRoom) => {
        if (err) return callback(err);

        if (foundRoom) {
            console.log("... Room found.");
            return callback(null, foundRoom);
        }
        else
            return callback(roomErrors.getRoomNotFoundError(roomId));
    })
};

// Check that the room exists and has sufficient beds for the number of users 
exports.checkRoomReadyForShotgun = (roomId, usersNb, callback) => {
    console.log("Checking room ready for Shotgun...");

    Room.findById(roomId, (err, room) => {
        if (err) return callback(err);

        if (!room)
            return callback(roomErrors.getRoomNotFoundError(roomId));
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
};
