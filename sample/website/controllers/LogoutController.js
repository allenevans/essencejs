/*
 * File         :   LogoutController.js
 * Description  :   User log out controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    BaseController) {
    "use strict";

    function LogoutController() {
        this.constructor.super_.apply(this, arguments);
    }

    util.inherits(LogoutController, BaseController);

    LogoutController.prototype.get = function (req, res) {
        req.logout();
        res.redirect('/');
    };

    return LogoutController;
};
