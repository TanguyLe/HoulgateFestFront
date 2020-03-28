module.exports = (app) => {
    let contact = require('../contact/contactController');

    app.route('/api/contact')
        .post(contact.send);
};
