let mongoose = require('mongoose'),
	Room = mongoose.model('Rooms'),
	Shotgun = mongoose.model('Shotguns');
	User = mongoose.model('Users'),
	shotgunComplete = require("./shotgunCompleteController"),
	async = require('async');


// Save shotgun in DB
exports.saveShotgun = (userId, room, callback) => {
	console.log("Saving shotgun...");
	let roomId = room._id;
	const shotgun = new Shotgun({ room: roomId, user: userId });

	async.waterfall([
		// Save in DB
		function (callback) {
			shotgun.save()
				.then(shotgun => {
					console.log("...Shotgun saved.");
					callback(null, shotgun);
				}).catch(err => {
					return callback(err);
				})
		},
		function (shotgun, callback) {
			console.log("Update owner user...");
			// Update the user owner of the shotgun
			// and complete the shotgun if only one bed in the room (room full)
			if (String(room.nbBeds) == "1") {
				shotgunComplete.completeShotgun(roomId, null, function (err, shotgun) {
					if (err) return callback(err);
					User.findByIdAndUpdate(shotgun.user,
						{
							hasShotgun: true,
							isShotgun: true,
							room : roomId
						}, { new: true }, function (err, foundUser) {
							if (err) return callback(err);

							if (!foundUser) {
								console.error("-> User not found.");
								let error = new Error('User with id ' + shotgun.user + ' not found.');
								error.name = "Error 404 : Not found";
								error.httpStatusCode = "404";
								return callback(error);
							}

							console.log("...User " + foundUser.username + " is updated.");
							callback(null, shotgun);
						})
				})
			}
			else {
				User.findByIdAndUpdate(shotgun.user,
					{
						isShotgun: true,
						room: roomId
					}, { new: true }, function (err, foundUser) {
						if (err) return callback(err);

						if (!foundUser) {
							console.error("-> User not found.");
							let error = new Error('User with id ' + shotgun.user + ' not found.');
							error.name = "Error 404 : Not found";
							error.httpStatusCode = "404";
							return callback(error);
						}

						console.log("...User " + foundUser.username + " is updated.");
						callback(null, shotgun);
					})
			}
		},
		// retrieve the full shotgun
		function (shotgun, callback) {
			Shotgun.findById(shotgun._id, { __v: 0 }).
				populate('room', { __v: 0 }).
				populate('user', { password: 0, __v: 0 }).
				exec(function (err, foundShotgun) {
					if (err) return callback(err);
					callback(null, foundShotgun);
				});
		}
	], function (err, shotgun) {
		if (err) callback(err);
		callback(null, shotgun);
	})
}