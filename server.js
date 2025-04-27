const express = require("express"),
    app = express(),
    port = process.env.PORT || 8000,
    path = require("path"),
    cors = require("cors");

const webPath = path.join(__dirname, "web");

serveFront = (req, res) => {
    if ([".png", ".js", ".jpg", ".ico"].includes(path.extname(req.originalUrl)))
        res.sendFile(path.join(webPath, req.originalUrl));
    else if (req.originalUrl.includes("api"))
        res.status(400).send({
            message: "This server is only for frontend and doesn't contain the API.",
        });
    else res.sendFile(path.join(webPath, "index.html"));
};

app.use(cors());
app.use(serveFront);
app.listen(port, () => console.log("HoulgateFestFront server started on: " + port));
