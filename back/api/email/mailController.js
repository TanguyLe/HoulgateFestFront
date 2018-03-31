let nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    Mail = mongoose.model('Mails'),
    emailConfig = require('./emailConfig');


const enhanceText = (text) => {
    return '<b>' + text + '</b>'
};

exports.mailSender = (req, res) => {
    let transporter = nodemailer.createTransport(emailConfig.ACCOUNT_CONFIG);
    let mailOptions = {
        to: "houlgatefest@gmail.com",
        from: "houlgatefest@gmail.com",
        subject: req.body.mailContent.subject || "Titre standard",
        text: req.body.mailContent.text || "Pas de contenu",
        html: enhanceText(req.body.mailContent.text) || "Pas de contenu"
    };
    let newMail = new Mail(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    res.status(200).json({
        message: 'mail sent'
    });
};