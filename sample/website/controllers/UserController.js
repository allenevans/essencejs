/*
 * File         :   UserController.js
 * Description  :   Users default controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    router,
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
        /* GET home page. */
        res.render('users',
            new UserModel({
                id : req.params.id,
                name : "User " + req.params.id
            })
        );
    };

    return UserController;
};
