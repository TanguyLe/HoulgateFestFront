let tokenUtils = require("./token");

exports.userAuth = (req, res, next) => {
    req.user = undefined;

    if (req.headers) {
        let accessToken = tokenUtils.getJWTToken(req.headers);

        if (accessToken)
            tokenUtils.checkAccessToken(accessToken, (err, decode) => {req.user = decode}, false);
    }
    next();
};

exports.notFound = (req, res) => {
    res.status(404).send({url: req.originalUrl + " not found"});
};
