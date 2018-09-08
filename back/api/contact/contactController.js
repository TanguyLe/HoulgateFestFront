let mail = require('../mail/mailController');


exports.send = (req, res) => {
    try {
        let title = `Mail de ${req.body.mailContent.firstname} ${req.body.mailContent.lastname}`;
        let content = `Joignable au ${req.body.mailContent.phone}, ou par mel au ${req.body.mailContent.mail}.
            Contenu de la demande : ${req.body.mailContent.content}`;
        let mailContent = {
            to: 'houlgatefest@gmail.com',
            subject: title,
            text: content
        };

        mail.mailSender(mailContent, (err) => {
            if (err) {
                return res.status(err.httpStatusCode || "500").send({
                    meta: {
                        error_type: err.name || "Error 500 : Internal Server Error",
                        code: err.httpStatusCode || "500",
                        error_message: err.message || "Some error occurred while sending contact request mail. Please retry later."
                    }
                });
            }
            let contactAnswer = {
                to: req.body.mailContent.mail,
                subject: "Demande de contact reçue",
                text: `Nous avons bien reçu votre demande. Ci-joint une copie du message envoyé : 
                "${req.body.mailContent.content}"`
            };

            mail.mailSender(contactAnswer, (err) => {
                if (err) {
                    return res.status(err.httpStatusCode || "500").send({
                        meta: {
                            error_type: err.name || "Error 500 : Internal Server Error",
                            code: err.httpStatusCode || "500",
                            error_message: err.message || "Some error occurred while sending contact answer mail."
                        }
                    });
                }
                return res.sendStatus(200);
            })
        });
    } catch (err) {
        console.error("Catch error :" + err);
        return res.status(500).send(err);
    }
};
