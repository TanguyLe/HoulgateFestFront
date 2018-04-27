module.exports = (app) => {
    let user = require("./userController");

    app.route("/users")
        .post(user.createUser);

    app.route("/login")
        .post(user.login);

    app.route("/refreshLogin")
        .post(user.refreshLogin);

    app.route("/users/:userId")
        .get(user.loginRequired, user.readUser);
};
