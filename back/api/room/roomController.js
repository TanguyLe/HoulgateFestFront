let mongoose = require('mongoose'),
    Room = mongoose.model('Rooms');

// Display list of all rooms.
exports.room_list = (req, res) => {
    Room.find()
    .then(rooms => {
        res.status(200).send({
            meta: {
                code: "200"
            },
            data: rooms
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving rooms."
        });
    });
};