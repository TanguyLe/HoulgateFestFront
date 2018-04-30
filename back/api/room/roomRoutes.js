module.exports = (app) => {
    let roomController = require('./roomController');

    app.route('/rooms')
        .get(roomController.roomList);
};