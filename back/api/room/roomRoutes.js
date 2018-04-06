module.exports = (app) => {
    let room_controller = require('./roomController');

    app.route('/rooms')
        .get(room_controller.room_list);
};