let mongoose = require('mongoose'),
	Room = mongoose.model('Rooms'),
	Shotgun = mongoose.model('Shotguns');
	User = mongoose.model('Users'),
	timeout = require("./timeoutController"),
	async = require('async');


/* Delete all shotguns own by the users */
exports.deleteShotguns = (usersId, callback) => {
	console.log("Deleting shotguns own by the roommates...")
	let stackDeleteShotguns = []
	usersId.forEach(
		function (item) {
			// delete shotgun -> can't use deleteMany cause need a ref to a specific shotgun to clear the timeout
			let deleteShotgun = function (callback) {
				Shotgun.findOneAndRemove({ user: item }, function (err, deletedShotgun) {
					if (err) return callback(err);
					if (deletedShotgun) {
						console.log("Shotgun associated to user with id " + item + " has been deleted."); // TODO : display line only if shotguns have been really found, here ,it just says the operation was made
						timeout.clearTimeout(deletedShotgun);
					}
					return callback();
				})
			}
			stackDeleteShotguns.push(deleteShotgun);
			// update the isShotgun field of the users
			let updateUser = function (callback) {
				User.findByIdAndUpdate(item, { isShotgun: false }, function (err, shotgun) {
					if (err) return callback(err);
					return callback();
				})
			}
			stackDeleteShotguns.push(updateUser);
		});


	async.parallel(stackDeleteShotguns, function (err, result) {
		if (err) {
			console.error("-> Error while deleting shotguns own by the roommates : " + err);
			let error = new Error("Error while deleting shotguns.");
			error.name = "Error 500 : Internal Server Error";
			error.httpStatusCode = "500";
			return callback(error);
		}
		console.log("... All shotguns associated to roommates, if any, deleted successfully.");
		return callback();
	})
}