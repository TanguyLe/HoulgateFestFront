let mongoose = require("mongoose"),
    User = mongoose.model("Users"),
    passwordUtils = require("../utils/password"),
    tokenUtils = require("../utils/token");


const fillUserAndTokens = (user, res) => {
    let accessToken = tokenUtils.generateAccessToken({username: user.username, email: user.email});

    res.json({"username": user.username,
              "accessToken": accessToken,
              "refreshToken": tokenUtils.generateRefreshToken(accessToken)});
};

exports.login = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) return res.status(401).json({ wrongField: "email",
                                                 message: "Authentication failed. User doesn't exist." });

        passwordUtils.comparePassword(req.body.password, user.password).then((authenticated) => {
            if (!authenticated)
                return res.status(401).json({ wrongField: "password",
                                              message: "Authentication failed. Invalid password." });

            if (err) res.send(err);
            else fillUserAndTokens(user, res);
        });
    });
};

exports.createUser = (req, res) => {
    passwordUtils.cryptPassword(req.body.password).then((resPassword) => {
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
        else
            res.json({"email": user.email, "username": user.username});
    });
};

exports.refreshLogin = (req, res) => {
    let user = undefined;
    let accessToken = tokenUtils.getJWTToken(req.headers);

    tokenUtils.checkAccessToken(accessToken, (err, decode) => {user = decode;}, true);

    if (!user || !tokenUtils.checkRefreshToken(accessToken, req.body.refreshToken)
              || !tokenUtils.checkIfAccessTokenExpired(accessToken))
        return res.status(401).json({ message: "Authentication failed. Invalid credentials."});

    let newAccessToken = tokenUtils.generateAccessToken({username: user.username, email: user.email});

    res.json({"username": user.username, "accessToken": newAccessToken, "refreshToken": tokenUtils.generateRefreshToken(newAccessToken)});

};

exports.loginRequired = (req, res, next) => {
    if (req.user)
        next();
    else
        return res.status(401).json({ message: "Authentication failed. Invalid credentials." });
};
