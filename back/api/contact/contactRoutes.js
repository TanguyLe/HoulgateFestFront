module.exports = (app) => {
    let contact = require('../contact/contactController');

    app.route('/contact')
        .post(contact.send);
};
