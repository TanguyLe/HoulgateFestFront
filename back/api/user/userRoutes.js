module.exports = (app) => {
    let user = require("./userController"),
        userActivator = require("./userActivator");

    userActivator.activator.init(userActivator.config);

    app.route("/api/users")
        .get(user.userList)
        .post(user.createUser, userActivator.activator.createActivate);

    app.route("/api/users/:userId")
        .get(user.loginRequired, user.readUser);

    app.route("/api/users/:user/activate")
        .get(userActivator.activator.completeActivateNext, user.afterCompleteActivation);

    app.route("/api/users/:user/passwordReset")
        .put(userActivator.activator.completePasswordResetNext, user.afterCompletePasswordReset);

    app.route("/api/passwordReset")
        .post(user.beforeCreatePasswordReset, userActivator.activator.createPasswordResetNext, user.afterCreatePasswordReset);

    app.route("/api/login")
        .post(user.login);

    app.route("/api/refreshLogin")
        .post(user.refreshLogin);

};
