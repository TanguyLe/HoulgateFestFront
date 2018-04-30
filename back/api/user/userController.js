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
exports.userList = (req, res) => {
    User.find({},{password: 0, __v: 0})
    .then(users => {
        res.status(200).send({
            meta: {
                code: "200"
            },
            data: users
        });
    }).catch(err => {
		res.status(500).send({
		meta: {
            error_type: "Error 500 : Internal Server Error",
            code: "500",
            error_message: err.message || "Some error occurred while retrieving users."
		  } 
        });
    });
};