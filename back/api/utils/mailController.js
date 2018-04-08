let nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    Mail = mongoose.model('Mails'),
    emailConfig = require('./emailConfig');


const enhanceText = (text) => {
    return '<b>' + text + '</b>'
};


exports.mailSender = (mailContent, cb) => {
    let transporter = nodemailer.createTransport(emailConfig.ACCOUNT_CONFIG);
    let mailOptions = {
        to: mailContent.to || "houlgatefest@gmail.com",
        from: "houlgatefest@gmail.com",
        subject: mailContent.subject || "Titre standard",
        text: mailContent.text || "Pas de contenu",
        html: enhanceText(mailContent.text) || "Pas de contenu"
    };
    let newMail = new Mail(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return cb(error);
        }
        console.log('Message sent: %s', info.messageId);
        transporter.close();
        return cb(false);
    });
};