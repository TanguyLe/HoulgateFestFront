//var room = require('./roomModel');

// Display list of all rooms.
exports.room_list = function(req, res) {
    res.status(200).json({
        "meta": {
            "code": 200
        },
        "data":  
        [
            {
                "created_at": "Tue Sep 04 15:55:52 +0000 2012",
                "type": "rooms",
                "_id": "243014525132091393",
                "nb_places": 3,
                "status": "available",
                "text": "LA plus belle des chambres"
            },
            {
                "created_at": "Tue Sep 05 15:55:52 +0000 2012",
                "type": "rooms",
                "_id": "243014525132091394",
                "nb_places": 2,
                "status": "available",
                "text": "LA deuxième plus belle des chambres"
            },
            {
                "created_at": "Tue Sep 05 15:55:52 +0000 2012",
                "type": "rooms",
                "_id": "243014525132091397",
                "nb_places": 2,
                "status": "notAvailable",
                "text": "LA troisième plus belle des chambres"
                }
        ]
    }
    );
};