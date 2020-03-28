module.exports = (app) => {
    let user = require("./userController");

    app.route("/api/users/:userId")
        .get(user.readUser);

};
