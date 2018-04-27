module.exports = (app) => {
    let user = require("./userController"),
        userActivator = require("./userActivator");

    userActivator.activator.init(userActivator.config);

    app.route("/users")
        .post(user.createUser, userActivator.activator.createActivate);

    app.route("/users/:user/activate")
        .get(userActivator.activator.completeActivateNext, user.afterCompleteActivation);

    app.route("/passwordReset")
        .post(user.beforeCreatePasswordReset, userActivator.activator.createPasswordResetNext, user.afterCreatePasswordReset);

    app.route("/users/:user/passwordReset")
        .put(userActivator.activator.completePasswordResetNext, user.afterCompletePasswordReset);

    app.route("/login")
        .post(user.login);

    app.route("/refreshLogin")
        .post(user.refreshLogin);

    app.route("/users/:userId")
        .get(user.loginRequired, user.readUser);
};
