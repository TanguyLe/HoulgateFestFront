module.exports = (app) => {
    let roomController = require('./roomController/roomRoutesHandlerController');

    app.route('/api/rooms')
        .get(roomController.roomList);
};
