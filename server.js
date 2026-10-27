const express = require("express"),
    app = express(),
    port = process.env.PORT || 8000,
    path = require("path"),
    helmet = require("helmet");

const webPath = path.join(__dirname, "web");

const originOf = (url) => {
    try {
        return new URL(url).origin;
    } catch {
        return null;
    }
};
// The bundle calls the API and embeds the Togetzer iframe, set at build time
const apiOrigin = originOf(process.env.API_URL);
const togetzerOrigin = originOf(process.env.TOGETZER_IFRAME_URL);
// The scores board URL is set on each edition from the admin interface, and the API only accepts
// https ones, so any https page can be framed
const semanticCdn = "https://cdnjs.cloudflare.com";
// The sign up captcha (Cloudflare Turnstile) loads its script and runs in an iframe
const turnstile = "https://challenges.cloudflare.com";

serveFront = (req, res) => {
    if ([".png", ".js", ".jpg", ".ico"].includes(path.extname(req.path)))
        // root makes sendFile reject paths escaping webPath (path traversal)
        res.sendFile(req.path, { root: webPath });
    else if (req.originalUrl.includes("api"))
        res.status(400).send({
            message: "This server is only for frontend and doesn't contain the API.",
        });
    else res.sendFile(path.join(webPath, "index.html"));
};

app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", turnstile],
                // style attributes set by React components and the carousel
                styleSrc: ["'self'", "'unsafe-inline'", semanticCdn],
                fontSrc: ["'self'", "data:", semanticCdn],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'", ...(apiOrigin ? [apiOrigin] : [])],
                frameSrc: ["https:", ...(togetzerOrigin ? [togetzerOrigin] : []), turnstile],
                frameAncestors: ["'none'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
            },
        },
    }),
);
app.use(serveFront);
app.listen(port, () => console.log("HoulgateFestFront server started on: " + port));
