let nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    Mail = mongoose.model('Mails'),
    emailConfig = require('./emailConfig');


const enhanceText = (text) => {
    return '<b>' + text + '</b>'
};


exports.mailSender = (mailContent, cb) => {
    let transporter = nodemailer.createTransport(emailConfig.ACCOUNT_CONFIG);
    mailContent.html = enhanceText(mailContent.text);
    let mailOptions = Object.assign(emailConfig.STANDARD_VALUES, mailContent);
    let newMail = new Mail(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return cb(error);
        }
        transporter.close();
        return cb(false);
    });
};