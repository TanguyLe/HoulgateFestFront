//var room = require('./shotgunModel');

// Handle Shotgun create on POST.
exports.shotgun_create_post = function(req, res) {
  res.status(200).json(
    {
      "meta": {
              "code": 200,
              "desc": "Shotgun created"
          },
      "data":  
      [
          {
            "created_at": "Wed Sep 05 00:07:01 +0000 2012",
            "type": "shotguns",
            "_id": "243138128959913986",
            "status ": "created",
            "user": {
                "created_at": "Wed Apr 23 20:32:35 +0000 2008",
                "type": "users",
                "_id": "14500363",
                "has_shotgun": false,
                "is_shotgun": true,
                "username": "Jake Boxer"
            },
            "room": {
              "created_at": "Tue Sep 04 15:55:52 +0000 2012",
              "type": "rooms",
              "id": 243014525132091393,
              "id_str": "243014525132091393",
              "nb_places": 3,
              "status": "notAvailable",
              "text": "LA plus belle des chambres",
              "status": "created"
              }
          }
        ]
      }
  );
};

// Handle Shotgun delete.
exports.shotgun_delete = function(req, res) {
  res.send(
    {
      "meta": {
              "code": 200,
              "desc": "Shotgun annulé"
          }
      }
  );
};

// Display list of all shotguned rooms.
exports.room_list = function(req, res) {
  res.status(200).json(
    {
    "meta": {
        "code": 200
    },
    "data":  
    [
      {
        "created_at": "Tue Sep 04 15:55:52 +0000 2012",
        "type": "rooms",
        "id": 243014525132091393,
        "id_str": "243014525132091393",
        "nb_places": 3,
        "status": "notAvailable",
        "text": "LA plus belle des chambres",
        "status": "created"
      },
      {
        "created_at": "Tue Sep 05 15:55:52 +0000 2012",
        "type": "rooms",
        "id": 243014525132091394,
        "id_str": "243014525132091394",
        "nb_places": 2,
        "status": "notAvailable",
        "text": "LA deuxième plus belle des chambres",
        "status": "created"
      }
    ]
  });
};

// Handle roommates create on PUT.
exports.roommates_add = function(req, res) {
  res.send(
    {
      "meta": {
              "code": 200,
              "desc": "Shotgun complete"
          },
      "data":  
      [
        {
          "created_at": "Wed Sep 05 00:07:01 +0000 2012",
          "_id": "243138128959913986",
          "status ": "done",
          "room": {
            "created_at": "Tue Sep 04 15:55:52 +0000 2012",
            "id": 243014525132091393,
            "id_str": "243014525132091393",
            "nb_places": 3,
            "text": "LA plus belle des chambres"
          },
          "roommates":
          [
            {
              "_id": "14500363",
              "username": "Joe le Taxi",
              "has_shotgun": true,
              "is_shotgun": false
          
            },
            {
              "_id": "14500363",
              "username": "Bob l’éponge",
              "has_shotgun": true,
              "is_shotgun": true
          
            },
            {
              "_id": "14500363",
              "username": "Batman",
              "has_shotgun": true,
              "is_shotgun": false
            },
          ],
          "user": {
            "created_at": "Tue Sep 04 15:55:52 +0000 2012",
            "id": "14500363",
            "username": "Joe le Taxi",
            "has_shotgun": true,
            "is_shotgun": false
        }
      }
      ]
    }
  );
};