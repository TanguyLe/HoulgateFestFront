module.exports = (app) => {
    let shotgunController = require('./shotgunController');

    app.route('/shotgun/rooms')
        .get(shotgunController.roomList);

    app.route('/shotgun/rooms/:roomId')
        .post(shotgunController.shotgunCreatePost);

    app.route('/shotgun/rooms/:roomId')
        .delete(shotgunController.shotgunDelete);

    app.route('/shotgun/rooms/:roomId')
        .put(shotgunController.roommatesAdd);
};