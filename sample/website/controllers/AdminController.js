/*
 * File         :   AdminController.js
 * Description  :   Admin default controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    AuthenticatedController) {
    "use strict";

    function AdminController(req, res, userService) {
        AuthenticatedController.apply(this, arguments);

        this.userService = userService;
    }

    util.inherits(AdminController, AuthenticatedController);

    AdminController.prototype.get = function (req, res, next) {
        this.userService.all(function (err, users) {
            if (err) {
                console.error(err);
                next(err);
            } else {
                res.render('admin', {users: users});
            }
        });
    };

    return AdminController;
};
