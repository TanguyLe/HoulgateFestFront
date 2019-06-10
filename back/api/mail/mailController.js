let nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    Mail = mongoose.model('Mails'),
    emailConfig = require('./emailConfig');


const enhanceText = (text) => {
    return '<b>' + text + '</b>';
};

exports.mailSender = (mailContent, cb, triedOnce) => {
    let STANDARD_VALUES = {};
    try {
        triedOnce = typeof triedOnce !== 'undefined' ? triedOnce : false;
        let transporter = nodemailer.createTransport(emailConfig.ACCOUNT_CONFIG);
        mailContent.html = enhanceText(mailContent.text);
        let mailOptions = Object.assign(STANDARD_VALUES, mailContent);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return cb(error);
            }
            transporter.close(); // pool is activated in emailConfig.js
            if (info.rejected.length > 0) {
                if (!triedOnce) {
                    // tries sending the email again in 1 minute with the rejected users list
                    mailContent.to = info.rejected;
                    setTimeout(this.timeoutTriggered.bind(null, mailContent, cb), 1000);
                }
                else {
                    let error = new Error("Email sending to " + mailContent.to + " failed after retry.");
                    error.name = "Error 500 : Internal Server Error";
                    error.httpStatusCode = "500";
                    cb(error);
                }
            }
            else return cb(false);
        });

    } catch (err) {
        console.error("Catch error: " + err);
        return cb(err);
    }
};

// Sending mail again after a timeout
exports.timeoutTriggered = (mailContent, callback) => {
    this.mailSender(mailContent, (err) => {
        if (err) {
            console.error("Email sending to " + mailContent.to + " with subject " + mailContent.subject + " failed.");
            return callback(err);
        }
        console.log("Email successfully sent to " + mailContent.to + ".");
        return callback(false);
    }, true); // set to true in order to indicate a second trial
};
