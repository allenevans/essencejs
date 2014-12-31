/*
 * File         :   LoginModel.js
 * Description  :   Model for holding user credentials during authentication.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    BaseModel
) {
    "use strict";

    function LoginModel(params) {
        this.title = params && params.title;
    }

    util.inherits(LoginModel, BaseModel);

    return LoginModel;
};
