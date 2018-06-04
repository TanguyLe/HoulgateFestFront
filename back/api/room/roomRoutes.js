module.exports = (app) => {
    let roomController = require('./roomController');

    app.route('/api/rooms')
        .get(roomController.roomList);
};