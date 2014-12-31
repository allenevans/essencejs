/*
 * File         :   LoginModel.js
 * Description  :   Model for holding user credentials during authentication.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (BaseModel) {
    "use strict";

    function LoginModel(params) {
        this.title = params && params.title;
    }

    LoginModel.prototype = new BaseModel();
    LoginModel.prototype.constructor = LoginModel;

    return LoginModel;
};
