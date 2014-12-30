/*
 * File         :   UserController.js
 * Description  :   Users default controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    BaseController,
    UserModel) {
    "use strict";

    function UserController() {
        this.path = ['/users/:id?', '/user-accounts/:id?'];

        BaseController.call(this);
    }

    UserController.prototype = new BaseController();
    UserController.prototype.constructor = UserController;

    UserController.prototype.get = function (req, res) {
        var userId = req.params.id;

        if (userId) {
            res.render('user',
                new UserModel({
                    id : req.params.id,
                    name : "User " + req.params.id
                })
            );
        } else {
            res.render('users', {});
        }
    };

    return UserController;
};
