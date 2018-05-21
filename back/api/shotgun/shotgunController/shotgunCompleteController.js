let mongoose = require('mongoose'),
	Shotgun = mongoose.model('Shotguns'),
	deleteShotgun = require('./shotgunDeleteController'),
	rollback = require("./rollbackController"),
	mail = require('../../utils/mailController'),
	async = require('async');

// update roommates and status fields 
// and delete all shotguns own by the roommates to free the rooms
exports.completeShotgun = (roomId, roommatesId, callback) => {
	console.log("Completing shotgun...");
	Shotgun.findOneAndUpdate({ room: roomId }, {
		roommates: roommatesId,
		status: 'done'
	}, { new: true })
		.then(shotgun => {
			if (!shotgun) {
				let error = new Error("-> Shotgun not found with roomId " + req.params.roomId);
				error.name = "Error 404 : Not found";
				error.httpStatusCode = "404";
				return callback(error);
			}

			// delete all shotguns own by the roommates
			if (roommatesId && roommatesId.length > 0) {
				deleteShotgun.deleteShotguns(roommatesId, function (err, result) {
					if (err) {
						console.log("-> Shotgun not completed.");
						return callback(err);
					}
					console.log("... Shotgun complete.");
					callback(null, shotgun);
				})
			}
			else {
				console.log("... Shotgun complete.");
				callback(null, shotgun);
			}

		}).catch(err => {
			console.log("-> Shotgun not completed.");
			rollback.rollBackShotgun(roomId, (error) => {
				if (error) return callback(error);
				return callback(err);
			});
		})
}

// handler after a complete shotgun
exports.afterCompleteShotgun = (shotgun) => {

	// retrieve the complete shotgun and populate the users' fields
	let retrieveShotgun = function (shotgun, callback) {
		Shotgun.findById(shotgun._id, { __v: 0 }).
			populate('room', { __v: 0 }).
			populate('user', { password: 0, __v: 0 }).
			populate('roommates', { password: 0, __v: 0 }).
			exec(function (err, populatedShotgun) {
				if (err) {
					console.error("-> Couldn't populate shotgun " + shotgun._id + ".");
					let error = new Error("Couldn't populate shotgun " + shotgun._id + ".");
					error.name = "Error 500 : Internal Server error";
					error.httpStatusCode = "500";
					return callback(error);
				}
				callback(null, populatedShotgun);
			});
	}


	// create and send a recap mail to all users
	let sendMails = function (populatedShotgun, callback) {

		let userOwner = populatedShotgun.user;
		let roommates = populatedShotgun.roommates;
		let users = roommates;
		users.push(userOwner);
		let room = populatedShotgun.room;

		let usersList = [];
		users.forEach(
			function (item) {
				usersList.push('<li>' + item.username + '</li>');
			}
		)

		let title = `Shotgun terminé !`;
		let content = `<p>Félicitations, tu as trouvé un endroit où dormir dans la belle villa des Gênets! </p>
		<br/>
		<p>
			Récapitulatif de ton shotgun: 
			<ul>
					<li>` + userOwner.username + ` a réservé la chambre ` + room.text + `.</li>
					<li>Compagnons de chambre : <ul>  ` + usersList + ` </ul></li>
			</ul>
		</p>
		<br/><br/>
		<br>A très bientôt à la villa!</br>
		<br/><br/>
		<i>Ceci est un mail automatique. Pour toute assistance, contactez-nous via <a href="mailto:houlegatefest.gmail.com">
		houlgatefest.gmail.com</a>.`;


		// send mail to all users
		var stackSendMail = [];
		users.forEach(
			function (item) {
				let mailContent = {
					to: item.email,
					subject: title,
					text: content
				};
				var sendMail = function (mailContent, callback) {
					mail.mailSender(mailContent, (err, sentMail) => {
						if (err) {
							console.error("-> Recap sending failed for user " + item.username + ".");
							let error = new Error("Couldn't send email to users after shotgun " + populatedShotgun._id + " completed.");
							error.name = "Error 500 : Internal Server error";
							error.httpStatusCode = "500";
							return callback(error);
						}
						console.log("Recap mail sent to " + item.username);
						return callback();
					}
					)
				}
				stackSendMail.push(sendMail.bind(null, mailContent));
			}
		)
		console.log("Sending recap emails to all users...");
		async.parallel(stackSendMail, callback);
	}

	async.waterfall([
		retrieveShotgun.bind(null, shotgun),
		sendMails
	], (err, result) => {
		if (err) return console.error("-> After complete shotgun failed for shotgun with id:" + shotgun._id + ".");
		return console.log("...Recap sent to all users.");
	})
}


