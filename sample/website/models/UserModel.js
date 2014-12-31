/*
 * File         :   UserModel.js
 * Description  :   The user model.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    BaseModel
) {
    "use strict";

    function UserModel(params) {
        this.id = params && params.id;
        this.name = params && params.name;
    }

    util.inherits(UserModel, BaseModel);

    return UserModel;
};
