let mongoose = require('mongoose'),
    Room = mongoose.model('Rooms');

// Display list of all rooms.
exports.roomList = (req, res) => {
    Room.find({}, {__v: 0})
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
