/*
 * File         :   LoginController.js
 * Description  :   User log in controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    BaseController,
    LoginModel,
    passport) {
    "use strict";

    function LoginController() {
        BaseController.call(this);
    }

    util.inherits(LoginController, BaseController);

    LoginController.prototype.get = function (req, res) {
        /* GET home page. */
        res.render('login', new LoginModel({}));
    };

    LoginController.prototype.post = function (req, res, next) {
        return passport.authenticate("local-login", {
            failureRedirect: '/login',
            successRedirect: '/admin'
        })(req, res, next);
    };

    return LoginController;
};
