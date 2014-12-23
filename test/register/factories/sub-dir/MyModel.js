/*
 * File         :   MyModel.js
 * Description  :   Test factory registration. A module that return the MyModule class.
 * ------------------------------------------------------------------------------------------------ */
function MyModel(params) {
    this.name = (params && params.name) || "no name defined"
};

MyModel.prototype.getName = function () {
   return this.name;
};

module.exports = MyModel;