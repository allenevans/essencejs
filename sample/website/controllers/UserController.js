/*
 * File         :   UserController.js
 * Description  :   Users default controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    AuthenticatedController,
    UserModel) {
    "use strict";

    function UserController(req, res, userService) {
        this.constructor.super_.apply(this, arguments);

        this.userService = userService;
    }

    util.inherits(UserController, AuthenticatedController);

    UserController.prototype.get = function (req, res, next) {
        var userId = req.params.id;

        this.userService.getById(userId, function (err, user) {
            if (err) {
                console.error(err);
                next(err);
            } else {
                res.render('user', user);
            }
        });
    };

    return UserController;
};
