let tokenUtils = require("./token"),
    labels = require("../../labels"),
    editionController = require('../edition/editionController');

exports.userAuth = (req, res, next) => {
    req.user = null;

    if (req.headers) {
        let accessToken = tokenUtils.getJWTToken(req.headers);

        if (accessToken)
            tokenUtils.checkAccessToken(accessToken, (err, decode) => {
                if (!err)
                    req.user = decode;
            }, false);
    }

    if (req.user !== null)
        next();
    else
        res.status(401).send({message: labels.FAILED_AUTH_INVALID_CRED_MSG});
};


exports.hasStarted = (req, res, next) => {
    if (process.env.HAS_STARTED === "1")
        next();
    else {
        editionController.getEditions(editions => {
            const currentEdition = editionController.getCurrentEditionFromEditions(editions);
            if ((currentEdition !== undefined) && (new Date() > currentEdition.shotgunDate))
                next();
            else
                res.status(400).send({message: "Shotgun has not started yet"});
        });
    }
};

exports.notFound = (req, res) => {
    res.status(404).send({url: req.originalUrl + " not found"});
};
