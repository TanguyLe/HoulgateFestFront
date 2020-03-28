let mongoose = require("mongoose"),
    User = mongoose.model("Users"),
    passwordUtils = require("../utils/password"),
    labels = require("../../labels"),
    tokenUtils = require("../utils/token");


const fillUserAndTokens = (user, res) => {
    let accessToken = tokenUtils.generateAccessToken({username: user.username, email: user.email});

    res.json({
        "username": user.username,
        "activated": user.activated,
        "accessToken": accessToken,
        "refreshToken": tokenUtils.generateRefreshToken(accessToken)
    });
};

exports.login = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) return res.status(401).json({wrongField: "email", message: labels.FAILED_AUTH_NO_USER_MSG});

        if (!user.activated) return res.status(401).json({wrongField: "activation"});

        passwordUtils.comparePassword(req.body.password, user.password).then((authenticated) => {
            if (!authenticated)
                return res.status(401).json({wrongField: "password", message: labels.FAILED_AUTH_WRONG_PSWD_MSG});

            if (err) res.send(err);
            else fillUserAndTokens(user, res);
        });
    });
};

exports.createUser = (req, res, next) => {
    passwordUtils.cryptPassword(req.body.password).then((resPassword) => {
        let newUserInfo = req.body;
        newUserInfo.password = resPassword;

        let newUser = new User(newUserInfo);
        newUser.save((err, user) => {

            if (err) res.send(err);
            else {
                fillUserAndTokens(user, res);
                req.activator = {id: user.id};
                next();
            }
        });
    });
};

exports.afterCompleteActivation = (req, res) => {
    User.findById(req.params.user, (err, user) => {
        if (err) res.send(err);
        else fillUserAndTokens(user, res);
    });
};

exports.readUser = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err) res.send(err);
        else
            res.json({"email": user.email, "username": user.username, "activated": user.activated});
    });
};

exports.beforeCreatePasswordReset = (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) res.json(err);
        else if (!user)
            return res.status(401).json({wrongField: "email", message: labels.FAILED_AUTH_NO_USER_MSG});
        else if (user && (!user.activated))
            return res.status(401).json({
                wrongField: "activation",
                message: labels.FAILED_AUTH_ACCOUNT_UNACTIVATED_MSG
            });

        req.params.user = user;
        next();
    });
};

exports.afterCreatePasswordReset = (req, res) => {
    res.status(200).json({})
};

exports.afterCompletePasswordReset = (req, res) => {
    res.status(200).json({});
};

exports.refreshLogin = (req, res) => {
    let user = undefined;
    let accessToken = tokenUtils.getJWTToken(req.headers);

    tokenUtils.checkAccessToken(accessToken, (err, decode) => {
        user = decode;
    }, true);

    if (!user || !tokenUtils.checkRefreshToken(accessToken, req.body.refreshToken)
        || !tokenUtils.checkIfAccessTokenExpired(accessToken))
        return res.status(401).json({message: labels.FAILED_AUTH_INVALID_CRED_MSG});

    let newAccessToken = tokenUtils.generateAccessToken({username: user.username, email: user.email});

    res.json({
        "username": user.username,
        "accessToken": newAccessToken,
        "refreshToken": tokenUtils.generateRefreshToken(newAccessToken)
    });

};

// Display list of all users.
exports.userList = (req, res) => {
    User.find({}, {password: 0, __v: 0})
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
