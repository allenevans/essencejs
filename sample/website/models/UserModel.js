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
        this.firstName = params && params.firstName;
        this.surname = params && params.surname;
        this.email = params && params.email;
        this.registered = params && params.registered;
        this.isActive = params && params.isActive;
        this.gender = params && params.gender;
        this.password = params && params.password;
    }

    util.inherits(UserModel, BaseModel);

    UserModel.prototype.displayName = function displayName() {
        return this.firstName + " " + this.surname;
    };

    return UserModel;
};
