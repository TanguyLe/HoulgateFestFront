let express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    cors = require('cors'),
    mongoose = require('mongoose'),
    User = require('./api/user/userModel'),
    Room = require('./api/room/roomModel'),
    Shotgun = require('./api/shotgun/shotgunModel'),
    middleware = require('./api/utils/middleware'),
    userRoutes = require('./api/user/userRoutes'),
    roomRoutes = require('./api/room/roomRoutes'),
    shotgunRoutes = require('./api/shotgun/shotgunRoutes'),
    Mail = require('./api/utils/mailModel'),
    contactRoutes = require('./api/contact/contactRoutes');
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Userdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));//get notification of connection errors

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(middleware.isFront);
app.use(middleware.userAuth);
userRoutes(app);
contactRoutes(app);
app.use(middleware.hasStarted);
roomRoutes(app);
shotgunRoutes(app);
app.use(middleware.notFound);

app.listen(port);

console.log("HoulgateFest server started on: " + port);
