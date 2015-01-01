/*
 * File         :   UserService.js
 * Description  :   Service for handling user.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (db, UserModel) {
    "use strict";

    /**
     * Service for handling user authentication.
     * @constructor
     */
    function UserService() {
        this.users = db.users;
    }

    UserService.prototype.getById = function getById(id, callback) {
        var user;

        for (var i = 0; i < this.users.length; i += 1) {
            user = this.users[i];

            if (user.id.toString() === id.toString()) {
                user = new UserModel(user);
                callback(null, user);
                return user;
            }
        }

        callback("Not found", null);
    };

    UserService.prototype.getByEmail = function getByEmail(email, callback) {
        var user;

        for (var i = 0; i < this.users.length; i += 1) {
            user = this.users[i];

            if (user.email.toLowerCase() === email.toLowerCase()) {
                user = new UserModel(user);
                callback(null, user);
                return user;
            }
        }

        callback("Not found", null);
    };

    UserService.prototype.all = function getByEmail(callback) {
        callback(null, db.users.map(function (user) {
            return new UserModel(user);
        }));
    };

    return UserService;
};