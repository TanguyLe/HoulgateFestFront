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
        let error = new Error('No user with email '+userEmail+' found.');
        error.name = "Error 400 : Query parameter error";
        error.httpStatusCode = "400";
        return callback(error);   
      }
      /* Check user hasn't shotgun or is not owner of another shotgun */
      if(foundUser.hasShotgun || foundUser.isShotgun){
        let error = new Error('User with email '+foundUser.username+' has already shotgun or owns a shotgun.');
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
      if (err) return callback(err);

      if(foundRoom) {
        console.log("... Room found.");
        return callback(null, foundRoom);
      }
      else {
        console.error("-> No room found.");
        let error = new Error('No room with id '+roomId+' found.');
        error.name = "Error 400 : Query parameter error";
        error.httpStatusCode = "400";
        return callback(error);  
        
      }
    })
}

function checkRoomNotShotgun(roomId, callback) {
  console.log("Check room "+roomId + " not shotgun...");
  Shotgun.findOne({ room: roomId },function(err, foundShotgun) {
    if (err) return callback(err);

    if(foundShotgun) {
      console.error("-> Room already shotgun.");
      let error = new Error('Room with id '+roomId+' already shotgun.');
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

/* Delete all shotguns own by the users */ 
function deleteShotguns(usersId, callback) {
  console.log("Deleting shotguns own by the roommates...")
  let stackDeleteShotguns = []
  usersId.forEach(
    function(item){
      // delete shotgun
      let deleteShotgun = function(callback) {
          Shotgun.deleteMany({user: item}, function(err, shotgun){
            if(err) return callback(err);
            console.log("Shotgun associated to user with id" + item + " has been deleted.");
            return callback();
        })
      }
    stackDeleteShotguns.push(deleteShotgun);
    // update the isShotgun field of the users
    let updateUser = function(callback) {
      User.findByIdAndUpdate(item, {isShotgun: false}, function(err, shotgun){
        if(err) return callback(err);
        return callback();
     })
    }
    stackDeleteShotguns.push(updateUser);
  });


  async.parallel(stackDeleteShotguns, function(err, result) {  
    if(err) {
      console.error("-> Error while deleting shotguns own by the roommates : " + err);
      let error = new Error("Error while deleting shotguns.");
      error.name = "Error 500 : Internal Server Error";
      error.httpStatusCode = "500";
      return callback(error);
    }
    console.log("... All shotguns deleted successfully.");
    return callback();
  })
}

/* update roommates and status fields 
** and delete all shotguns own by the roommates to free the rooms */
function completeShotgun(roomId, roommatesId, callback) {
  Shotgun.findOneAndUpdate({room: roomId}, {
    roommates: roommatesId,
    status: 'done'
  }, {new: true})
  .then(shotgun => {
    if(!shotgun) {
      let error = new Error("Shotgun not found with roomId " + req.params.roomId);
      error.name = "Error 404 : Not found";
      error.httpStatusCode = "404";
      return callback(error); 
    }

    // delete all shotguns own by the roommates
    if(roommatesId){
      deleteShotguns(roommatesId, function(err, result){
        if(err) return callback(err);
        console.log("... Shotgun complete.");
        callback(null, shotgun);
      })
    }
    else callback(null, shotgun);

  }).catch(err => {
    return callback(err);
  })
}

/* Save shotgun in DB */
function saveShotgun(userId, room, callback) {
  console.log("saving...");
  let roomId = room._id;
  const shotgun = new Shotgun({ room: roomId, user: userId });
  async.waterfall([
    // Save in DB
    function(callback) {
      shotgun.save()
      .then(shotgun => {
        console.log("...Shotgun saved.");
        callback(null, shotgun);
      }).catch(err => {
        return callback(err);
      })
    },
    function(shotgun, callback) {
      console.log("Update owner user...");
      // Update the user owner of the shotgun
      // and complete the shotgun if only one bed in the room
      if(String(room.nbBeds) == "1"){
        completeShotgun(roomId, null, function(err, shotgun){
          if(err) return callback(err);
          User.findByIdAndUpdate(shotgun.user,  
            {
              hasShotgun: true,
              isShotgun: true 
            }, {new: true}, function(err, foundUser){
            if(err) return callback(err);
            
            if(!foundUser){
              console.error("User not found.");
              let error = new Error('User with id '+shotgun.user+' not found.');
              error.name = "Error 404 : Not found";
              error.httpStatusCode = "404";
              return callback(error);  
            }
            console.log("User "+ foundUser.username + " is updated.");
            callback(null, shotgun);
          })
        })
      }
      else {
        User.findByIdAndUpdate(shotgun.user,  
          {
            isShotgun: true 
          }, {new: true}, function(err, foundUser){
          if(err) return callback(err);
          
          if(!foundUser){
            console.error("User not found.");
            let error = new Error('User with id '+shotgun.user+' not found.');
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error);  
          }
          console.log("User "+ foundUser.username + " is updated.");
          callback(null, shotgun);
        })
      } 
    },
    // retrieve the full shotgun
    function(shotgun, callback) {
      Shotgun.findById(shotgun._id, {__v: 0}).
      populate('room', {__v: 0}).
      populate('user', {password: 0, __v: 0}).
      exec(function (err, foundShotgun) {
        if (err) return callback(err);
        callback(null, foundShotgun);
      });
    }
], function(err, shotgun) {
    if (err) callback(err);
    callback(null, shotgun);
  }
)}


// Handle Shotgun create on POST.
exports.shotgunCreatePost = function(req, res) {

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
                callback(null, room);
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

      ], function(err, results) { /// end of async.parallel
        if (err) {
          console.error("-> Error before saving to DB.");
          return callback(err);
        }
        console.log("... Room OK.");
        callback(null, results); // results contains the owner userId and the room
      })
    }, function(results, callback){
      // Save shotgun in DB
      saveShotgun(results[0], results[1][0], function(err, shotgun) {
        if (err) {
          console.error("-> Shotgun saving error.");
          return callback(err);
        }
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
exports.shotgunDelete = function(req, res) {
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

  if (!req.params.roomId){
    return res.status(400).send({
        meta: {
          error_type: "Error 400 : Query parameter error",
          code: "400",
          error_message: "RoomId query parameter can not be empty"
        }
    });
  }

  console.log("Deleting Shotgun...");
  async.waterfall([
    // find the shotgun
    function(callback){
      console.log("Find shotgun...")
      // Find shotgun
      Shotgun.findOne({room : req.params.roomId}, function(err, shotgun){
        if(err) return callback(err);
        if(!shotgun) {
          console.error("-> Error : No shotgun to delete.");
          let error = new Error("Shotgun not found with roomId " + req.params.roomId);
          error.name = "Error 404 : Not found";
          error.httpStatusCode = "404";
          return callback(error); 
        }
        console.log("... Shotgun found.");
        callback(null, shotgun);
      })
  },
    // check user owner
    function(shotgun, callback){
      console.log("Check user owner...");
      User.findOne({email: req.body.email}, function(err, user){
        if(err) return callback(err);
        if(!user){
        console.error("-> User with email "+req.body.email+ " not found.");
        let error = new Error('User with email '+req.body.email+' not found.');
        error.name = "Error 404 : Not found";
        error.httpStatusCode = "404";
        return callback(error);  
        }
        // check that only the user owner can update his room
        if(!(String(user._id) === String(shotgun.user))){
          console.error("-> User " + user.username +" doesn't own the shotgun. Can't delete the shotgun.");
          let error = new Error("User "+user.username+" doesn't own the shotgun. Delete forbidden");
          error.name = "Error 403 : Forbidden";
          error.httpStatusCode = "403";
          return callback(error);
        }
        callback();
      })
    },
    // Delete shotgun
    function(callback){
      Shotgun.findOneAndRemove({room: req.params.roomId}, function(err, deletedShotgun) {
        if (err) {
          console.error("-> Shotgun deleting error.");
          let error = new Error('Shotgun with roomId '+req.params.roomId+' could not be deleted.');
          error.name = "Error 500 : Internal Server Error";
          error.httpStatusCode = "500";
          return callback(error); 
        }
        if(!deletedShotgun){
          console.error("-> Error : No shotgun to delete.");
          let error = new Error('Shotgun with roomId '+req.params.roomId+' not found.');
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error); 
        }
        console.log("... Shotgun successfully deleted.");
        callback(null, deletedShotgun)
      });
    },
    function(shotgun, callback){
      let rollBackRoommates = function(shotgun, callback){
        let users = shotgun.roommates;
        if(!users) {
          console.log("No roommates to roll back.");
          return callback()
        }
        rollBackUsers(users, shotgun.room, function(err) {
          if (err) {
            console.error("-> Error while rolling back the users.");
            return callback(err);
          }
          console.log("... Users successfully rolled back.");
          callback();
        }
      )
    }

    let updateUserOwner = function(shotgun, callback){
      // special tratment for user owner
      User.findByIdAndUpdate(shotgun.user, {hasShotgun : false, isShotgun: false }, function(err, user){
        if(err) return callback(err);
        callback();
      })
    }

      async.parallel({
        rollBack : rollBackRoommates.bind(null, shotgun),
        update : updateUserOwner.bind(null, shotgun)
      }, callback)

  }], function(err) {
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
exports.roomList = function(req, res) {

  Shotgun.find({}, {__v: 0}).
  populate('room', {__v: 0}).
  exec(function (err, foundShotguns) {
      if (err) {
        return res.status("500").send({
          meta: {
            error_type: "Error 500 : Internal Server Error",
            code: "500",
            error_message: err.message || "Some error occurred while retrieving shotguns."
          } 
        });
      }
      res.status(200).send({
        meta: {
          code: "200"
        }, 
        data: foundShotguns
      });
    });
};

// Handle roommates addition to shotgun on PUT.
exports.roommatesAdd = function(req, res) {

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

  let stackUpdateUsers = [];

  /* Create tasks for checking and updating the users */
  let updateUsers = req.query.roommates.split(',');
  updateUsers.forEach(
    function(item){
      let updateUser = function(callback) {
          User.findOne({email: item}, function(err, user){
            if(err) return callback(err);
            if(!user){
            console.error("-> User with email "+item+ " not found");
            let error = new Error('User with email '+item+' not found.');
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error);  
            }
            if(user.hasShotgun){
              console.error("-> User " + user.username +" has already shotgun");
              let error = new Error('User '+user.username+' has already shotgun.');
              error.name = "Error 409 : Conflict";
              error.httpStatusCode = "409";
              return callback(error);
            }
            user.hasShotgun = true;
            user.room = req.params.roomId;
            user.save()
            .then( user => {
              console.log("User " + user.username + " has shotgun.");
              return callback(null, user._id);
            }).catch(err => {
              console.error("-> User " + user.username + " could not be udpated.")
              let error = new Error("Couldn't save "+user.username);
              error.name = "Error 500 : Internal Server Error";
              error.httpStatusCode = "500";
              return callback(error);
          });
        })
      }
    stackUpdateUsers.push(updateUser);
  });

  /* Add roommates */
  async.waterfall([
    // find room and check that the number of roommates isn't exceeding the number of beds
    function(callback) {
      console.log("Checking room exists...");
      Room.findById(req.params.roomId, function(err, room){
        if(err) return callback(err);
        
        if(!room){
          console.error("-> Room not found");
          let error = new Error('Room with id '+req.params.roomId+' not found.');
          error.name = "Error 404 : Not found";
          error.httpStatusCode = "404";
          return callback(error);  
        }
        if(room.nbBeds < (updateUsers.length + 1)){
          console.error("-> Not enough space in selected room");
          let error = new Error('Too many roommates for room with id '+req.params.roomId + ' : not enough beds');
          error.name = "Error 403 : Forbidden";
          error.httpStatusCode = "403";
          return callback(error);
        }
        console.log("... Room exists.");
        callback();
      })
    },
    // find the shotgun
    function(callback){
        console.log("Find shotgun...")
        // Find shotgun
        Shotgun.findOne({room : req.params.roomId}, function(err, shotgun){
          if(err) return callback(err);
          if(!shotgun) {
            let error = new Error("Shotgun not found with roomId " + req.params.roomId);
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error); 
          }
          console.log("... Shotgun found.");
          callback(null, shotgun);
        })
    },
    // Check and update the owner user and the roommates
    function(shotgun, callback){
      console.log("Shotgun all users  ...");
      async.waterfall([
        // check and shotgun the owner user
        function(callback){
          User.findOne({email: req.body.email}, function(err, user){
            if(err) return callback(err);
            if(!user){
            console.error("-> User with email "+req.body.email+ " not found.");
            let error = new Error('User with email '+req.body.email+' not found.');
            error.name = "Error 404 : Not found";
            error.httpStatusCode = "404";
            return callback(error);  
            }
            // check that only the user owner can update his room
            if(!(String(user._id) === String(shotgun.user))){
              console.error("-> User " + user.username +" doesn't own the shotgun. Can't update the shotgun.");
              let error = new Error("User "+user.username+" doesn't own the shotgun. Update forbidden");
              error.name = "Error 403 : Forbidden";
              error.httpStatusCode = "403";
              return callback(error);
            }
            // check that the user owner isn't shotgun by someone else
            if(user.hasShotgun){
              console.error("-> User owner " + user.username +" has already shotgun.");
              let error = new Error('User owner '+user.username+' has already shotgun.');
              error.name = "Error 409 : Conflict";
              error.httpStatusCode = "409";
              return callback(error);
            }
            user.hasShotgun = true;
            user.room = req.params.roomId;
            user.save(function (err) {
              if(err) {
                console.error("-> User " + user.username + "could not be udpated.")
                let error = new Error("Couldn't save "+user.username);
                error.name = "Error 500 : Internal Server Error";
                error.httpStatusCode = "500";
                return callback(error);
              }
              console.log("User owner " + user.username + " has shotgun.")
              callback(null, user);
            })
          })
        }, 
        // check and shotgun the roommates
        function(owner,callback) {
          // can't use parallel tasks because if a user has shotgun, the remaining users will continue to shotgun while an error
          // would have been thrown and the roolback begun just after, leading to inconsistency.
          async.series(stackUpdateUsers, function(error, foundRoommatesId) {  
            
            if(error) {
              console.error("-> Error before shotgun users : " + error);
              // rolling back the users
              let users = updateUsers;
              users.push(owner._id);
              rollBackUsers(users, req.params.roomId, function(err) {
                if(err){
                  return callback(err);
                }
                let error = new Error("Error caused roll back of all users.");
                error.name = "Error 400 : Bad request";
                error.httpStatusCode = "400";
                return callback(error);
              });
            }
            else {
              callback(null, foundRoommatesId);
            }
          })
        }
      ], function(err, roommatesId){
        if(err) return callback(err);
        console.log("... All users added successfully.")
        callback(null, roommatesId);
      }
    )}, function(roommatesId, callback){
        console.log("Confirming shotgun...")
        // Find shotgun and update it with the request query
        completeShotgun(req.params.roomId, roommatesId, function(err, shotgun){
          if(err) return callback(err);
          callback(null, shotgun);
        })
      },
      // retrieve the complete shotgun and populate all its fields
      function(shotgun, callback){
        Shotgun.findById(shotgun._id, {__v: 0}).
        populate('room', {__v: 0}).
        populate('user', {password: 0, __v: 0}).
        populate('roommates', {password: 0, __v: 0}).
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

// Roll back users to before shotgun state
let rollBackUsers = function(users, roomId, callback) {
  console.log("Rolling back users..." + users);
  let stackUpdateUsers = [];
  users.forEach(
    function(item){
      // depending on the type of item we call findById or findOne
      if(item instanceof mongoose.Types.ObjectId) {
        var updateUser = function(callback) {
          User.findById(item, function(err, user){
            if(err) return callback(err);
          
            if(!user){
              console.error("-> User with ID " + item + " not found. Not rolled back.");
              return callback();
            }
            if(user.hasShotgun){
              if(String(roomId) === String(user.room)){
                // the user has shotgun for the specified room, we free him
                user.hasShotgun = false;
                user.room = null;
                user.save()
                .then( user => {
                  console.log("User " + user.username + " rolled back.");
                  return callback(null, user._id);
                }).catch(err => {
                    console.error("-> User " + user.username + " could not be udpated." + err);
                    let error = new Error("Couldn't save "+user.username);
                    error.name = "Error 500 : Internal Server Error";
                    error.httpStatusCode = "500";
                    return callback(error);
                });
              }
              else {
                console.log("User " + user.username + " has already shotgun another room. Not rolled back.");
                return callback(null, user._id);
              }
            }
            else {
              console.log("User " + user.username + " hasn't shotgun yet. Not rolled back.")
              return callback(null, user._id);
            }
          })
        }
      }
      else {
        var updateUser = function(callback) {
          User.findOne({email: item}, function(err, user){
            if(err) return callback(err);
          
            if(!user){
              console.error("-> User " + item + " not found. Not rolled back.");
              return callback();
            }
            if(user.hasShotgun){
              if(String(roomId) === String(user.room)){
                // the user has shotgun for the specified room, we free him
                user.hasShotgun = false;
                user.room = null;
                // then
                user.save()
                .then( user => {
                  console.log("User " + user.username + " rolled back.");
                  return callback(null, user._id);
                }).catch(err => {
                    console.error("-> User " + user.username + " could not be udpated." + err);
                    let error = new Error("Couldn't save "+user.username);
                    error.name = "Error 500 : Internal Server Error";
                    error.httpStatusCode = "500";
                    return callback(error);
                });
              }
              else {
                console.log("User " + user.username + " has already shotgun another room. Not rolled back.");
                return callback(null, user._id);
              }
            }
            else {
              console.log("User " + user.username + " hasn't shotgun yet. Not rolled back.")
              return callback(null, user._id);
            }
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
  let usersId = shotgun.roommates;
  usersId.push(shotgun.user);
  async.series([
  function(callback){
    rollBackUsers(usersId, shotgun.room, function(err) {
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