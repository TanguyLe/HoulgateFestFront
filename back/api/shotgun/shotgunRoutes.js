module.exports = (app) => {
    let shotgunController = require('./shotgunController/shotgunRoutesHandlerController'),
        shotgunCompleteController = require('./shotgunController/shotgunCompleteController');

    app.route('/api/shotgun/rooms')
        .get(shotgunController.roomList);

    app.route('/api/shotgun/rooms/:roomId')
        .post(shotgunController.shotgunCreatePost, shotgunCompleteController.afterCompleteShotgun);

    app.route('/api/shotgun/rooms/:roomId')
        .delete(shotgunController.shotgunDelete);

    app.route('/api/shotgun/rooms/:roomId')
        .put(shotgunController.roommatesAdd, shotgunCompleteController.afterCompleteShotgun);
};
