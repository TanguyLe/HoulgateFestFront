module.exports = (app) => {
    let user = require("./userController");

    app.route("/users/:userId")
        .get(user.readUser);

};
