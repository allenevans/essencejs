/*
 * File         :   AuthenticateService.js
 * Description  :   Service for handling user authentication.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function () {
    "use strict";

    /**
     * Service for handling user authentication.
     * @constructor
     */
    function AuthenticateService(userService) {
        this.userService = userService;
    }

    /**
     * Authenticate the users credentials
     * @param {string} email unique user identification such as an email address.
     * @param {string} password users password
     * @param {function} callback function with the result.
     */
    AuthenticateService.prototype.authenticate = function authenticate(email, password, callback) {
        this.userService.getByEmail(email, function (err, user) {
            if (user && user.email === email && user.password === password) {
                callback(null, user);
            } else {
                callback(null, false);
            }
        });
    };

    return AuthenticateService;
};