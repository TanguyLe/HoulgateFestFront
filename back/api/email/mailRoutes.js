module.exports = (app) => {
    let mail = require('./mailController');
    let middleware = require('./../utils/middleware');

    app.route('/emails')
        .post(mail.mailSender);
};

