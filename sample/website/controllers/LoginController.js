/*
 * File         :   LoginController.js
 * Description  :   User log in controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    BaseController,
    LoginModel,
    passport) {
    "use strict";

    function LoginController() {
        BaseController.call(this);
    }

    LoginController.prototype = new BaseController();
    LoginController.prototype.constructor = LoginController;

    LoginController.prototype.get = function (req, res) {
        /* GET home page. */
        res.render('login', new LoginModel({}));
    };

    LoginController.prototype.post = function (req, res, next) {
        return passport.authenticate("local-login", {
            failureRedirect: '/login',
            successRedirect: '/user'
        })(req, res, next);
    };

    return LoginController;
};
