module.exports = (app) => {
    let shotgun_controller = require('./shotgunController');

    app.route('/shotgun/rooms')
        .get(shotgun_controller.room_list);

    app.route('/shotgun/rooms')
        .post(shotgun_controller.shotgun_create_post);

    app.route('/shotgun/rooms/:roomId')
        .delete(shotgun_controller.shotgun_delete);

    app.route('/shotgun/rooms/:roomId/roommates')
        .post(shotgun_controller.roommates_add);
};