/*
 * File         :   AuthenticatedController.js
 * Description  :   Abstract controller to inherit from to ensure user is authenticated.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    BaseController) {
    "use strict";

    function AuthenticatedController() {
        BaseController.apply(this, arguments);
    }

    util.inherits(AuthenticatedController, BaseController);

    AuthenticatedController.prototype.all = function (req, res, next) {
        if (req.user) {
            // user is authenticated
            next();
            return;
        }

        // this is an unauthenticated request.
        res.redirect("/login");
    };

    return AuthenticatedController;
};