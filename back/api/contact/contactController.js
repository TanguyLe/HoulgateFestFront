let mailSender = require('../utils/mailController');


exports.send = (req, res) => {
    let mailContent = {
        subject: req.body.mailContent.subject || "Titre standard",
        text: req.body.mailContent.text || "Pas de contenu",
    };

    mailSender(mailContent, (err) => {
        if (err)
            res.status(500).send(err);
        let contactAnswer = {
            subject: "Demande de contact reçue",
            text: "Mail bien reçu ! Cimer frero"
        };

        res.status(200).send('Message envoyé')
    });
};
