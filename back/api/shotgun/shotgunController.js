//var room = require('./shotgunModel');

// Handle Shotgun create on POST.
exports.shotgun_create_post = function(req, res) {
  res.status(200).json(
    {
    "meta": {
            "code": 200,
            "desc": "Shotgun created"
        },
     "data":  {
        "created_at": "Wed Sep 05 00:07:01 +0000 2012",
        "type": "shotgun",
          "id": 243138128959913986,
        "id_str": "243138128959913986",
        "status ": "created",
          "user": {
            "created_at": "Wed Apr 23 20:32:35 +0000 2008",
            "type": "users",
            "default_profile": false,
            "default_profile_image": false,
            "description": "Developer at GitHub in San Francisco, CA.rnrnChicken nuggets is like my family.",
            "id": 14500363,
            "id_str": "14500363",
            "has_shotgun": false,
                "is_shotgun": true,
            "lang": "en",
            "location": "San Francisco, CA",
            "name": "Jake Boxer",
            "notifications": false,
            "profile_background_color": "352726",
            "profile_background_image_url": "http://a0.twimg.com/images/themes/theme5/bg.gif",
            "profile_background_image_url_https": "https://si0.twimg.com/images/themes/theme5/bg.gif",
            "profile_background_tile": false,
            "profile_image_url": "http://a0.twimg.com/profile_images/1621757700/twitter_normal.png",
            "profile_image_url_https": "https://si0.twimg.com/profile_images/1621757700/twitter_normal.png",
            "profile_link_color": "D02B55",
            "profile_sidebar_border_color": "829D5E",
            "profile_sidebar_fill_color": "99CC33",
            "profile_text_color": "3E4415",
            "profile_use_background_image": true,
            "protected": false,
            "screen_name": "jake_boxer",
            "show_all_inline_media": false,
            "statuses_count": 5398,
            "time_zone": "Eastern Time (US & Canada)",
            "url": "http://jakeboxer.com/",
            "utc_offset": -18000,
            "verified": false
          }
    }
  });
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
            "status": "available",
        "text": "LA plus belle des chambres",
        "status": "created"
        },
        {
        "created_at": "Tue Sep 05 15:55:52 +0000 2012",
        "type": "rooms",
        "id": 243014525132091394,
        "id_str": "243014525132091394",
        "nb_places": 2,
            "status": "available",
        "text": "LA deuxième plus belle des chambres",
        "status": "created"
        }
    ]
  });
};

// Handle roommates create on POST.
exports.roommates_add = function(req, res) {
  res.send(
    {
      "meta": {
              "code": 200,
       "desc": "Shotgun complete"
          },
        "created_at": "Wed Sep 05 00:07:01 +0000 2012",
        "id": 243138128959913986,
      "id_str": "243138128959913986",
      "status ": "done",
      "room": {
        "created_at": "Tue Sep 04 15:55:52 +0000 2012",
        "id": 243014525132091393,
        "id_str": "243014525132091393",
        "nb_places": 3,
        "text": "LA plus belle des chambres"
        },
      "roomates":
      [
        {
        "id": 243014525132091393,
        "id_str": "14500363",
             "name": "Joe le Taxi",
             "has_shotgun": true,
             "is_shotgun": false
       
        },
        {
        "id": 243014525132091394,
        "id_str": "14500363",
              "name": "Bob l’éponge",
              "has_shotgun": true,
             "is_shotgun": true
       
        },
        {
        "id": 243014525132091395,
          "id_str": "14500363",
             "name": "Batman",
             "has_shotgun": true,
             "is_shotgun": false
        },
        
      ],
      "user": {
        "created_at": "Wed Apr 23 20:32:35 +0000 2008",
        "default_profile": false,
        "default_profile_image": false,
        "description": "Developer at GitHub in San Francisco, CA.rnrnChicken nuggets is like my family.",
        "id": 14500363,
        "id_str": "14500363",
        "has_shotgun": true,
             "is_shotgun": false,
        "lang": "en",
        "location": "San Francisco, CA",
        "name": "Jake Boxer",
        "notifications": false,
        "profile_background_color": "352726",
        "profile_background_image_url": "http://a0.twimg.com/images/themes/theme5/bg.gif",
        "profile_background_image_url_https": "https://si0.twimg.com/images/themes/theme5/bg.gif",
        "profile_background_tile": false,
          "profile_image_url": "http://a0.twimg.com/profile_images/1621757700/twitter_normal.png",
        "profile_image_url_https": "https://si0.twimg.com/profile_images/1621757700/twitter_normal.png",
        "profile_link_color": "D02B55",
        "profile_sidebar_border_color": "829D5E",
        "profile_sidebar_fill_color": "99CC33",
        "profile_text_color": "3E4415",
        "profile_use_background_image": true,
        "protected": false,
        "screen_name": "jake_boxer",
        "show_all_inline_media": false,
        "statuses_count": 5398,
        "time_zone": "Eastern Time (US & Canada)",
        "url": "http://jakeboxer.com/",
        "utc_offset": -18000,
        "verified": false
        }
      }
      
  );
};