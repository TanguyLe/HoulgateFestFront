let tokenUtils = require("./token"),
    path = require('path'),
    labels = require("../../labels"),
    pth = path.join(__dirname, '..', '..', '..', '/front/web'),
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


exports.isFront = (req, res, next) => {
    if ([".png", ".js", ".jpg"].includes(path.extname(req.originalUrl)))
        res.sendFile(pth + req.originalUrl);
    else if (req.originalUrl === '/houlgatefest.min.js')
        res.sendFile(pth + '/houlgatefest.min.js');
    else if (req.originalUrl.split('/')[1] === 'api')
        next();
    else
        res.sendFile(pth + '/index.html');
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
