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

exports.hasStarted = (req, res, next) => {if (process.env.HAS_STARTED !== "1")
        res.status(200).send({message: "Shotgun has not started yet"});
    else
        next();
};

exports.notFound = (req, res) => {
    res.status(404).send({url: req.originalUrl + " not found"});
};
