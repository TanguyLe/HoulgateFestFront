module.exports = (app) => {
    let contact = require('../contact/contactController');
    let middleware = require('./../utils/middleware');

    app.route('/contact')
        .post(contact.send);
};
