let mongoose = require('mongoose'),
    Shotgun = mongoose.model('Shotguns'),
    User = mongoose.model('Users'),
    Room = mongoose.model('Rooms');

let async = require('async')

function checkUserOK(userEmail, callback) {
  console.log("Check user OK...");
  User.findOne({email: userEmail})
  .then(foundUser => {
      // No results ... User doesn't exist
      if(!foundUser) {
        console.log("User not found");
        var error = new Error('No user with email '+userEmail+' found.');
        error.name = "Error 400 : Query parameter error";
        error.httpStatusCode = "400";
        return callback(error);   
      }
      /* Check user hasn't shotgun or is not owner of another shotgun */
      if(foundUser.has_shotgun || foundUser.is_shotgun){
        var error = new Error('User with email '+foundUser.username+' has already shotgun.');
        error.name = "Error 409 : Conflict";
        error.httpStatusCode = "409";
        return callback(error);
      }
      return callback(null, foundUser);

    }).catch(err => {
      return callback(err);
    })
}

function checkRoomExists(roomId, callback) {
  console.log("Check room " + roomId + " exists...");

    Room.findOne({ _id: roomId },function(err, foundRoom) {
      
      if (err) { /* handle err */ 
        return callback(err);
      }
      if(foundRoom) {
        console.log("... Room found.");
        return callback(null, foundRoom);
      }
      else {
        console.error("-> No room found.");
        var error = new Error('No room with id '+roomId+' found.');
        error.name = "Error 400 : Query parameter error";
        error.httpStatusCode = "400";
        return callback(error);  
        
      }
    })
}

function checkRoomNotShotgun(roomId, callback) {
  console.log("Check room "+roomId + " not shotgun...");
  Shotgun.findOne({ room: roomId },function(err, foundShotgun) {
    if (err) { /* handle err */ 
      return callback(err);
    }

    if(foundShotgun) {
      console.error("-> Room already shotgun.");
      var error = new Error('Room with id '+roomId+' already shotgun.');
      error.name = "Error 400 : Query parameter error";
      error.httpStatusCode = "400";
      return callback(error);  
    }
    else {
      console.log("... Shotgun is possible.");
      return callback();
    }
  });
}

function saveShotgun(roomId, userId, callback) {
  console.log("saving...");
  const shotgun = new Shotgun({ room: roomId, user: userId });
  async.waterfall([
    // Save in DB
    function(callback) {
      shotgun.save(function(err) {
        if (err) {
          console.error("Shotgun save error.");
          return callback(err);
        }
        console.log("Shotgun save succeeded.");
        callback(null, shotgun);
      });
    },
    // Update the is_shotgun field of the user owner of the shotgun
    function(shotgun, callback) {
      console.log("update user...");
      User.findByIdAndUpdate(shotgun.user,  
        {
          is_shotgun: true 
        }, {new: true}, function(err, foundUser){
        if(err) return callback(err);
        
        if(!foundUser){
          console.error("User not found.");
          var error = new Error('User with id '+shotgun.user+' not found.');
          error.name = "Error 404 : Not found";
          error.httpStatusCode = "404";
          return callback(error);  
        }
        console.log("User "+ foundUser.username + " is updated.");
        callback(null, shotgun);
      })
    },
    // retrieve the full shotgun
    function(shotgun, callback) {
      Shotgun.findById(shotgun._id).
      populate('room').
      populate('user', {password: 0}).
      exec(function (err, foundShotgun) {
        if (err) return callback(err);
        callback(null, foundShotgun);
      });
    }
], function(err, shotgun) { //This function gets called after the two tasks have called their "task callbacks"
    if (err) callback(err);
    callback(null, shotgun);
  }
)}


// Handle Shotgun create on POST.
exports.shotgun_create_post = function(req, res) {

 // Validate Request
 if(!req.body.email) {
  console.error("-> User body parameter is empty.");
  return res.status(400).send({
    meta: {
      error_type: "Error 400 : Body parameter error",
      code: "400",
      error_message: "User body parameter can not be empty"
    }
  });
  }

  if(!req.params.roomId) {
    console.error("-> Room query parameter is empty.");
    return res.status(400).send({
      meta: {
        error_type: "Error 400 : Query parameter error",
        code: "400",
        error_message: "Room query parameter can not be empty"
      }
    });
  }

  if (!req.params.roomId.match(/^[0-9a-fA-F]{24}$/)) {
    console.error("-> Room query parameter not ObjectID.");
    return res.status(400).send({
      meta: {
        error_type: "Error 400 : Query parameter error",
        code: "400",
        error_message: "RoomID not an Object ID (Cast Error)"
      }
    });
  }

  async.waterfall([
    function(callback){
      async.parallel([
        // check that user exists and hasn't already shotgun
        function(callback) {
          checkUserOK(req.body.email, function(err, user) {
              if (err) {
                console.error("-> Error check user.")
                return callback(err);
              }
              console.log("... User OK.");
              callback(null, user._id);
          });
        },

        //Check room exists, is available and not already associated to a shotgun
        function(callback) {
          async.series([
            function(callback) {
              checkRoomExists(req.params.roomId, function(err, room) {
                if (err) return callback(err);
                console.log("... Room "+ room._id + " exists.");
                callback();
              });
            },
            function(callback){
              checkRoomNotShotgun(req.params.roomId, function(err) {
                if (err) {
                  console.error("-> Error check room not shotgun.");
                  return callback(err);
                }
                console.log("... Room "+ req.params.roomId +" not shotgun.");
                callback();
            });
            }
          ], callback);
        }

      ], function(err, results) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) {
          console.error("-> Error before saving to DB.");
          return callback(err);
        }
        console.log("... Room OK.");
        callback(null, results[0]);
      })
    }, function(userId, callback){
      // Save shotgun in DB
      saveShotgun(req.params.roomId, userId, function(err, shotgun) {
        if (err) {
          console.error("-> Shotgun saving error.");
          return callback(err);
        }
        console.log("... Shotgun saved.");
        callback(null, shotgun);
      })
    }
    ], function(err, shotgun) {
      if(err){
        return res.status(err.httpStatusCode || "500").send({
          meta: {
            error_type: err.name,
            code: err.httpStatusCode || "500",
            error_message: err.message || "Some error occurred while creating the Shotgun."
          } 
        });
      }
      console.log("... Shotgun is created.");
      return res.status(200).send({
        meta : {
          code: "200",
          desc: "Shotgun created successfully!"
        }, 
        data: shotgun
      });

    });
};

// Handle Shotgun delete.
exports.shotgun_delete = function(req, res) {
  async.waterfall([
    // Delete shotgun
    function(callback){
      Shotgun.findOneAndRemove({room: req.params.roomId}, function(err, deletedShotgun) {
        if (err) {
          console.error("-> Shotgun deleting error.");
          if(err.kind === 'ObjectId') {
            var error = new Error("Shotgun with id " + req.params.roomId + " not found with id " );
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error);         
          }
          else {
            var error = new Error('Shotgun with roomId '+req.params.roomId+' could not be deleted.');
            error.name = "Error 500 : Internal Server Error";
            error.httpStatusCode = "500";
            return callback(error); 
          }

        }
        if(!deletedShotgun){
          console.error("-> Error : No shotgun to delete.");
          var error = new Error('Shotgun with roomId '+req.params.roomId+' not found.');
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error); 
        }
        console.log("... Shotgun successfully deleted.");
        callback(null, deletedShotgun)
      });
    },
    function(shotgun, callback){
      rollBackUsers(shotgun.roommates, shotgun.room, function(err, users) {
        if (err) {
          console.error("-> Error while rolling back the users.");
          return callback(err);
        }
        console.log("... Users successfully rolled back.");
        callback();
      }
    )}
  ], function(err, results) {
    if (err) {
      console.error("-> Error while deleting from DB.");
      return res.status(err.httpStatusCode || "500").send({
        meta: {
          error_type: err.name,
          code: err.httpStatusCode || "500",
          error_message: err.message || "Some error occurred while deleting the Shotgun."
        } 
      });
    }
    console.log("... Shotgun deleted.")
    res.send({
      meta : {
        code: "200",
        desc: "Shotgun deleted successfully!"
      }
    });
  })
}

// Display list of all shotguned rooms.
exports.room_list = function(req, res) {

  Shotgun.find().
  populate('room').
  exec(function (err, foundShotguns) {
      if (err) return handleError(err);
      res.status(200).send({
        meta: {
          code: "200"
        }, 
        data: foundShotguns
      });
    });
};


// Handle roommates addition to shotgun on PUT.
exports.roommates_add = function(req, res) {

  // Validate Request
  if(!req.body.email) {
    return res.status(400).send({
      meta: {
        error_type: "Error 400 : Query parameter error",
        code: "400",
        error_message: "User query parameter can not be empty"
      }
    });
    }

  if(!req.query.roommates) {
      return res.status(400).send({
        meta: {
          error_type: "Error 400 : Query parameter error",
          code: "400",
          error_message: "Roommates query parameter can not be empty"
        }
      });
  }

  if (!req.params.roomId){
    return res.status(400).send({
        meta: {
          error_type: "Error 400 : Query parameter error",
          code: "400",
          error_message: "RoomId query parameter can not be empty"
        }
    });
  }

  var stackUpdateUsers = [];

  /* Create parallel tasks for checking and updating the users */
  var updateUsers = req.query.roommates.split(',');
  updateUsers.forEach(
    function(item){
      var updateUser = function(callback) {
          User.findOne({email: item}, function(err, user){
            if(err) return callback(err);
            if(!user){
            console.error("-> User with email "+item+ " not found");
            var error = new Error('User with email '+item+' not found.');
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error);  
            }
            if(user.has_shotgun){
              console.error("-> User " + user.username +" has already shotgun");
              var error = new Error('User '+user.username+' has already shotgun.');
              error.name = "Error 409 : Conflict";
              error.httpStatusCode = "409";
              return callback(error);
            }
            user.has_shotgun = true;
            user.room = req.params.roomId;
            user.save(function (err) {
              if(err) {
                console.error("-> User " + user.username + "could not be udpated.")
                var error = new Error("Couldn't save "+user.username);
                error.name = "Error 500 : Internal Server Error";
                error.httpStatusCode = "500";
                return callback(error);
              }
          });
          console.log("User " + user.username + " has shotgun.")
          callback(null, user._id);
        })
      }
    stackUpdateUsers.push(updateUser);
  });



  /* Add roommates */
  async.waterfall([
    // find room and check that the number of roommates isn't exceeding the number of places
    function(callback) {
      console.log("Checking room exists...");
      Room.findById(req.params.roomId, function(err, room){
        if(err) return callback(err);
        
        if(!room){
          console.error("-> Room not found");
          var error = new Error('Room with id '+req.params.roomId+' not found.');
          error.name = "Error 404 : Not found";
          error.httpStatusCode = "404";
          return callback(error);  
        }
        if(room.nb_places < (updateUsers.length - 1)){
          console.error("-> Not enough space in selected room");
          var error = new Error('Too many roommates for room with id '+req.params.roomId + ' : not enough places');
          error.name = "Error 403 : Forbidden";
          error.httpStatusCode = "403";
          return callback(error);
        }
        console.log("... Room exists.");
        callback();
      })
    },
    // Check and update the roommates and the owner
    function(callback){
      console.log("Shotgun all users  ...");
      async.waterfall([
        function(callback){
          User.findOne({email: req.body.email}, function(err, user){
            if(err) return callback(err);
            if(!user){
            console.error("-> User with email "+item+ " not found");
            var error = new Error('User with email '+item+' not found.');
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error);  
            }
            if(user.has_shotgun){
              console.error("-> User " + user.username +" has already shotgun");
              var error = new Error('User '+user.username+' has already shotgun.');
              error.name = "Error 409 : Conflict";
              error.httpStatusCode = "409";
              return callback(error);
            }
            user.has_shotgun = true;
            user.room = req.params.roomId;
            user.save(function (err) {
              if(err) {
                console.error("-> User " + user.username + "could not be udpated.")
                var error = new Error("Couldn't save "+user.username);
                error.name = "Error 500 : Internal Server Error";
                error.httpStatusCode = "500";
                return callback(error);
              }
            });
            console.log("User owner " + user.username + " has shotgun.")
            callback();
          })
        }, function(callback) {
          async.series(stackUpdateUsers, function(err, foundRoommatesId) {  
            if(err) {
              console.error("-> Error before shotgun users");
              // rolling back the users
              rollBackUsers(updateUsers, req.params.roomId, function(err, shotgun){
                if(err){
                  var error = new Error("Error during the roll back.");
                  error.name = "Error 500 : Internal Server Error";
                  error.httpStatusCode = "500";
                  return callback(error);
                }
              })
              return callback(err);
            }
            callback(null, foundRoommatesId);
        })
  }
], function(err, roomatesId){
    if(err) return callback(err);
    console.log("... All users added successfully.")
    callback(null, roomatesId);
  }
)}, function(roommatesId, callback){
    console.log("Confirming shotgun...")
    // Find shotgun and update it with the request query
    Shotgun.findOneAndUpdate({room : req.params.roomId}, {
      roommates: roommatesId,
      status: 'done'
    }, {new: true}, function(err, shotgun){
      if(err) return callback(err);
      if(!shotgun) {
        var error = new Error("Shotgun not found with roomId " + req.params.roomId);
        error.name = "Error 404 : Not found";
        error.httpStatusCode = "404";
        return callback(error); 
      }
      console.log("... Shotgun complete.");
      callback(null, shotgun);
    })
  },
  // retrieve the complete shotgun and populate all its fields
  function(shotgun, callback){
    console.log("Retrieve shotgun" + shotgun);
    Shotgun.findById(shotgun._id).
    populate('room').
    populate('user', {password: 0}).
    populate('roommates', {password: 0}).
    exec(function (err, populatedShotgun) {
      if (err) return callback(err);
      callback(null, populatedShotgun);
    });
  }
], function(err, shotgun) {
  if (err) {
    if(err.kind === 'ObjectId') {
      return res.status(404).send({
        meta: {
          error_type: "Error 404 : Not found",
          code: "404",
          error_message: "Shotgun not found with id " + req.params.roomId
        }
      });                
    }
    else return res.status(err.httpStatusCode || "500").send({
    meta: {
      error_type: err.name,
      code: err.httpStatusCode || "500",
      error_message: err.message || "Some error occurred while adding the roommates "
    } 
  });
  }

  res.send({
    meta: {
      code: "200",
      desc: "Shotgun complete"
    },
    data: shotgun
  });
})
};

// Roll back users to not shotgun state
let rollBackUsers = function(users, roomIdStr, callback) {
  console.log("Rolling back users..." + users)
  // validate the parameters
  if(typeof roomIdStr == 'undefined') {
    console.error("-> Error : RoomId undefined");
    var error = new Error('RoomId is undefined');
    error.name = "Error 500 : Internal Server Error";
    error.httpStatusCode = "500";
    return callback(error);  
  }
  var stackUpdateUsers = [];
  users.forEach(
    function(item){
      console.log("This is item " + item);
      if(item instanceof mongoose.Schema.Types.ObjectId){
        console.log("First updateUser with item" + item + "of type "+ typeof item);
        var updateUser = function(callback) {
          User.findById(item, function(err, user){
            if(err) return callback(err);
          
            if(!user){
              console.error("-> User with ID " + item + " not found");
              var error = new Error('User with id '+item+' not found.');
              error.name = "Error 404 : Not found";
              error.httpStatusCode = "404";
              return callback(error);  
            }
            if(user.has_shotgun && (typeof user.room != 'undefined' && roomIdStr == user.room)){
              // the user has shotgun for the specified room, we free him
              user.has_shotgun = false;
              user.room = null;
              user.save(function (err) {
                if(err) {
                  console.error("-> User " + user.username + "could not be udpated.")
                  var error = new Error("Couldn't save "+user.username);
                  error.name = "Error 500 : Internal Server Error";
                  error.httpStatusCode = "500";
                  return callback(error);
                }
              });
              console.log("User " + user.username + " rolled back.");
            }
            else console.log("User " + user.username + " has already shotgun another room.");
            callback(null, user._id);
          })
        }
      }
      else {
        console.log("First updateUser with item" + item + "of type "+ typeof item);
        var updateUser = function(callback) {
          User.findOne({email: item}, function(err, user){
            if(err) return callback(err);
          
            if(!user){
              console.error("-> User " + item + " not found");
              var error = new Error('User with email '+item+' not found.');
              error.name = "Error 404 : Not found";
              error.httpStatusCode = "404";
              return callback(error);  
            }
            if(user.has_shotgun && (typeof user.room != 'undefined' && roomIdStr == user.room)){
              // the user has shotgun for the specified room, we free him
              user.has_shotgun = false;
              user.room = null;
              user.save(function (err) {
                if(err) {
                  console.error("-> User " + user.username + "could not be udpated.")
                  var error = new Error("Couldn't save "+user.username);
                  error.name = "Error 500 : Internal Server Error";
                  error.httpStatusCode = "500";
                  return callback(error);
                }
              });
              console.log("User " + user.username + " rolled back.");
            }
            else console.log("User " + user.username + " has already shotgun another room.");
            callback(null, user._id);
          })
        }
      }
    stackUpdateUsers.push(updateUser);
  });

  async.parallel(stackUpdateUsers, function(err, foundRoommatesId) {  
    if(err) {
      return callback(err);
    }
    return callback();
  })
}

// Roll back to shotgun created state
let rollBackShotgun = function(shotgun, callback) {
  console.log("Rolling back shotgun...");
  var usersId = shotgun.roommates;
  usersId.push(shotgun.user);
  async.series([
  function(callback){
    rollBackUsers(usersId, shotgun.room, function(err, users) {
      if (err) {
        console.error("-> Error while rolling back the users");
        return callback(err);
      }
      console.log("... Users successfully rolled back.");
      callback();
    }
  )},
  function(callback){
    Shotgun.findByIdAndUpdate(shotgun._id, {
      roommates: [],
      status: 'created'
    }, {new: true}, function(err, shotgun){
      if(err){
          console.error("-> Error while rolling back the Shotgun.");
          return callback(err);
      }
      console.log("... Shotgun successfully rolled back.");
      return callback(null, shotgun);
    })
  }
], function(err, shotgun){
    if(err){
      console.error("-> Some errors occured while rolling back the shotgun.");
      return callback(err);
    }
    console.log("Shotgun now in previous created state.");
    callback(null, shotgun);
  })
}