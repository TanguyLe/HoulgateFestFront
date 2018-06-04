module.exports = (app) => {
    let contact = require('../contact/contactController');
    let middleware = require('./../utils/middleware');

    app.route('/api/contact')
        .post(middleware.userAuth, contact.send);
};
