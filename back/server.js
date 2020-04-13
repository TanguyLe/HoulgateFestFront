let express = require("express"),
    cors = require('cors'),
    bodyParser = require('body-parser'),

    app = express(),
    port = process.env.PORT || 3000,

    User = require('./api/user/userModel'),
    Room = require('./api/room/roomModel'),
    Shotgun = require('./api/shotgun/shotgunModel'),
    Edition = require('./api/edition/editionModel'),
    Mail = require('./api/mail/mailModel'),

    middleware = require('./api/utils/middleware'),
    scriptsUtils = require("./scripts/scriptsUtils"),

    userRoutes = require('./api/user/userRoutes'),
    userRoutesWithAuth = require('./api/user/userRoutesWithAuth'),
    editionRoutes = require('./api/edition/editionRoutes'),
    roomRoutes = require('./api/room/roomRoutes'),
    shotgunRoutes = require('./api/shotgun/shotgunRoutes'),
    contactRoutes = require('./api/contact/contactRoutes');

scriptsUtils.connectToDb("mongodb://localhost/Userdb");

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

userRoutes(app);
app.use(middleware.userAuth);
userRoutesWithAuth(app);
contactRoutes(app);
editionRoutes(app);
app.use(middleware.hasStarted);
roomRoutes(app);
shotgunRoutes(app);

app.use(middleware.notFound);

app.listen(port, () =>
    console.log("HoulgateFestBack server started on: " + port)
);
