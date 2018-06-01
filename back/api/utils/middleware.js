let tokenUtils = require("./token"),
    path = require('path'),
    pth = path.join(__dirname, '..', '..', '..', '/front/web');

exports.userAuth = (req, res, next) => {
    req.user = undefined;

    if (req.headers) {
        let accessToken = tokenUtils.getJWTToken(req.headers);

        if (accessToken)
            tokenUtils.checkAccessToken(accessToken, (err, decode) => {
                req.user = decode
            }, false);
    }
    next();
};

exports.isFront = (req, res, next) => {
    if (path.extname(req.originalUrl))
        res.sendFile(pth + req.originalUrl);
    else if (req.originalUrl === '/houlgatefest.min.js')
        res.sendFile(pth + '/houlgatefest.min.js');
    else if (req.originalUrl.split('/')[1] === 'api') {
        console.log(req.originalUrl);
        next();
    }
    else
        res.sendFile(pth + '/index.html');
};


exports.hasStarted = (req, res, next) => {
    if (process.env.HAS_STARTED !== "1")
        res.status(200).send({message: "Shotgun has not started yet"});
    else
        next();
};

exports.notFound = (req, res) => {
    res.status(404).send({url: req.originalUrl + " not found"});
};
