let express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    path = require('path'),
    cors = require('cors');


const webPath = path.join(__dirname, 'web');
const staticPath = path.join(webPath, 'static');

serveFront = (req, res) => {
    if ([".png", ".jpg"].includes(path.extname(req.originalUrl)))
        res.sendFile(path.join(staticPath, req.originalUrl));
    else if (req.originalUrl === '/houlgatefest.min.js')
        res.sendFile(path.join(webPath, 'houlgatefest.min.js'));
    else
        res.sendFile(path.join(webPath, 'index.html'));
};

app.use(cors());
app.use(serveFront);
app.listen(port, () =>
    console.log("HoulgateFestFront server started on: " + port)
);
