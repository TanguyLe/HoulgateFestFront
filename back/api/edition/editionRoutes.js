let editionController = require('./editionController');

const getEditions = (req, res) => {

    editionController.getEditions(editions => {
            res.status(200).send({
                meta: {
                    code: "200"
                },
                data: (req.query.current !== undefined ?
                    (req.query.current ? editionController.getCurrentEditionFromEditions(editions) : editions)
                    : editions)
            })
        },
        err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving editions."
            });
        });
};

module.exports = (app) => {
    app.route('/edition')
        .get(getEditions);
};
