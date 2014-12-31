/*
 * File         :   AuthenticateService.js
 * Description  :   Service for handling user authentication.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function ( ) {
    "use strict";

    /**
     * Service for handling user authentication.
     * @constructor
     */
    function AuthenticateService() { }

    /**
     * Authenticate the users credentials
     * @param {string} userIdent unique user identification such as an email address.
     * @param {string} password users password
     * @param {function} callback function with the result.
     */
    AuthenticateService.prototype.authenticate = function authenticate(userIdent, password, callback) {
        if (userIdent === "a@b.c" && password === "123") {
            // user successfully authenticated.
            callback(null, { id : 1, email : userIdent, friendlyName : "bob" });

            return;
        }

        callback(null, false);
    };

    return AuthenticateService;
};