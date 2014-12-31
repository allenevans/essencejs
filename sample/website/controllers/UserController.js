/*
 * File         :   UserController.js
 * Description  :   Users default controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    BaseController,
    UserModel) {
    "use strict";

    function UserController(req, res) {
        this.constructor.super_.apply(this, arguments);
    }

    util.inherits(UserController, BaseController);

    UserController.prototype.get = function (req, res) {
        var userId = req.params.id;

        if (userId) {
            res.render('user',
                new UserModel({
                    id : req.params.id,
                    name : "User " + this.name
                })
            );
        } else {
            res.render('users', {});
        }
    };

    return UserController;
};
