let mongoose = require("mongoose"),
    editionController = require('./editionController'),
    Edition = mongoose.model("Edition");

const getEditions = (req, res) => {

    Edition.find({}, {__v: 0})
        .then(editions => {
            res.status(200).send({
                meta: {
                    code: "200"
                },
                data: (req.query.current !== undefined ?
                    (req.query.current ? editionController.getCurrentEditionFromEditions(editions) : editions)
                    : editions)
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving editions."
        });
    });
};

module.exports = (app) => {
    app.route('/api/edition')
        .get(getEditions);
};
