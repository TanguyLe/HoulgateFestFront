let mongoose = require("mongoose"),
	User = mongoose.model("Users"),
	passwordUtils = require("../utils/password"),
	tokenUtils = require("../utils/token");

const fillUserAndTokens = (user, res) => {
	let accessToken = tokenUtils.generateAccessToken({
		username: user.username,
		email: user.email
	});

	res.json({
		username: user.username,
		accessToken: accessToken,
		refreshToken: tokenUtils.generateRefreshToken(accessToken)
	});
};

exports.login = (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user)
			return res
				.status(401)
				.json({ message: "Authentication failed. Invalid user." });

		passwordUtils
			.comparePassword(req.body.password, user.password)
			.then(resPassword => {
				if (!resPassword)
					return res
						.status(401)
						.json({
							message: "Authentication failed. Invalid password."
						});

				if (err) res.send(err);
				else fillUserAndTokens(user, res);
			});
	});
};

exports.createUser = (req, res) => {
	passwordUtils.cryptPassword(req.body.password).then(resPassword => {
		let newUserInfo = req.body;
		newUserInfo.password = resPassword;

		let newUser = new User(newUserInfo);
		newUser.save((err, user) => {
			if (err) res.send(err);
			else fillUserAndTokens(user, res);
		});
	});
};

exports.readUser = (req, res) => {
	User.findById(req.params.userId, (err, user) => {
		if (err) res.send(err);
		else res.json({ email: user.email, username: user.username });
	});
};

exports.refreshLogin = (req, res) => {
	let user = undefined;
	let accessToken = tokenUtils.getJWTToken(req.headers);

	tokenUtils.checkAccessToken(
		accessToken,
		(err, decode) => {
			user = decode;
		},
		true
	);

	if (!user)
		return res
			.status(401)
			.json({ message: "Authentication failed. Invalid accessToken." });
	if (!tokenUtils.checkRefreshToken(accessToken, req.body.refreshToken))
		return res
			.status(401)
			.json({ message: "Authentication failed. Invalid refreshToken." });
	if (!tokenUtils.checkIfAccessTokenExpired(accessToken))
		return res
			.status(401)
			.json({
				message:
					"Authentication failed. Invalid accessToken(not expired)."
			});

	let newAccessToken = tokenUtils.generateAccessToken({
		username: user.username,
		email: user.email
	});

	res.json({
		username: user.username,
		accessToken: newAccessToken,
		refreshToken: tokenUtils.generateRefreshToken(newAccessToken)
	});
};

exports.loginRequired = (req, res, next) => {
	if (req.user) next();
	else
		return res
			.status(401)
			.json({ message: "Authentication failed. Invalid accessToken." });
};

// Display list of all users.
exports.user_list = function(req, res) {
	res.status(200).json({
		meta: {
			code: 200
		},
		data: [
			{
				created_at: "Tue Sep 04 15:55:52 +0000 2012",
				id: "14500363",
				username: "Joe le Taxi",
				has_shotgun: true,
				is_shotgun: false
			},
			{
				created_at: "Tue Sep 04 15:55:52 +0000 2012",
				id: "14500364",
				username: "Bob l’éponge",
				has_shotgun: true,
				is_shotgun: true
			},
			{
				created_at: "Tue Sep 04 15:55:52 +0000 2012",
				id: "14500365",
				username: "Batman",
				has_shotgun: true,
				is_shotgun: false
			}
		]
	});
};
