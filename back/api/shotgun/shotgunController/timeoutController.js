let mongoose = require('mongoose'),
	Shotgun = mongoose.model('Shotguns'),
	shotgunComplete = require("./shotgunCompleteController"),
	async = require('async');

var tuttimer = {};

// Set a timeout of 5 min linked to a shotgun
exports.setTimeout = (shotgun) => {
	const timeoutObj = setTimeout(this.timeoutTriggered.bind(null, shotgun), 300000);
	tuttimer[shotgun._id] = timeoutObj;
}

// Clear a timeout related to a shotgun
exports.clearTimeout = (shotgun) => {
	clearTimeout(tuttimer[shotgun._id]);
}

// Delete shotgun not completed after a timeout
exports.timeoutTriggered = (shotgun) => {
	console.log("Timeout triggered for shotgun on room " + shotgun.room._id);

	// check if shotgun exists and delete it if shotgun is not completed
	Shotgun.findById(shotgun._id, function (err, shotgun) {
		if (err) console.error(err);
		if (!shotgun) {
			console.log("...shotgun is NOT done after timeout. Nothing to be done.");
			return;
		}
		if (shotgun.status !== 'done') {
			console.log("Deleting Shotgun on room " + shotgun.room + "...");
			// delete shotgun
			let deleteShotgun = function (shotgun, callback) {
				Shotgun.findByIdAndRemove(shotgun._id, function (err, deletedShotgun) {
					if (err) {
						console.error("-> Shotgun deleting error.");
						let error = new Error('Shotgun with roomId ' + shotgun.room + ' could not be deleted.');
						error.name = "Error 500 : Internal Server Error";
						error.httpStatusCode = "500";
						return callback(error);
					}
					if (!deletedShotgun) {
						console.error("-> Error : No shotgun to delete.");
						let error = new Error('Shotgun with roomId ' + shotgun.room + ' not found.');
						error.name = "Error 404 : Not found";
						error.httpStatusCode = "404";
						return callback(error);
					}
					callback(null, deletedShotgun)
				});
			}

			let updateUserOwner = function (shotgun, callback) {
				// special treatment for user owner
				User.findByIdAndUpdate(shotgun.user, { hasShotgun: false, isShotgun: false }, function (err, user) {
					if (err) return callback(err);
					callback();
				})
			}

			async.parallel({
				delete: deleteShotgun.bind(null, shotgun),
				update: updateUserOwner.bind(null, shotgun)
			}, function (err) {
				if (err) {
					console.error("-> Error while deleting from DB.");
					return;
				}
				console.log("...shotgun on room " + shotgun.room + " deleted.")
			})
		}
		else {
			console.log("...shotgun is done after timeout.");
			shotgunComplete.afterCompleteShotgun(shotgun);
		}
		return;
	})
}