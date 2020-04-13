module.exports = (app) => {
    let roomController = require('./roomController/roomRoutesHandlerController');

    app.route('/rooms')
        .get(roomController.roomList);
};
