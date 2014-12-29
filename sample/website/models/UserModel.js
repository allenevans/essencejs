/*
 * File         :   UserModel.js
 * Description  :   The user model.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (BaseModel) {
    "use strict";

    function UserModel(params) {
        this.id = params && params.id;
        this.name = params && params.name;
    }

    UserModel.prototype = new BaseModel();
    UserModel.prototype.constructor = UserModel;

    return UserModel;
};
