let mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    tokenUtils = require('../utils/tokenUtils');

exports.login = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) res.send(err);
        if (!user) return res.status(401).json({ message: 'Authentication failed. Invalid user.' });
        if (user.password !== req.body.password)
            return res.status(401).json({ message: 'Authentication failed. Invalid password.' });

        let accessToken = tokenUtils.generateAccessToken({username: user.username, email: user.email});

        res.json({"username": user.username,
                  "accessToken": accessToken,
                  "refreshToken": tokenUtils.generateRefreshToken(accessToken)});
    });
};

exports.createUser = (req, res) => {
    let new_user = new User(req.body);
    new_user.save((err, user) => {
        if (err) res.send(err);
        else
            res.json({"email": user.email, "username": user.username});
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

    if (!user) return res.status(401).json({ message: 'Authentication failed. Invalid accessToken.' });
    if (!tokenUtils.checkRefreshToken(accessToken, req.body.refreshToken))
        return res.status(401).json({ message: 'Authentication failed. Invalid refreshToken.' });
    if (!tokenUtils.checkIfAccessTokenExpired(accessToken))
        return res.status(401).json({ message: 'Authentication failed. Invalid accessToken(not expired).' });

    let newAccessToken = tokenUtils.generateAccessToken({username: user.username, email: user.email});

    res.json({"username": user.username, "accessToken": newAccessToken, "refreshToken": tokenUtils.generateRefreshToken(newAccessToken)});

};

exports.loginRequired = (req, res, next) => {
    if (req.user)
        next();
    else
        return res.status(401).json({ message: 'Authentication failed. Invalid accessToken.' });
};
