/*
 * File         :   MyModel.js
 * Description  :   Test factory registration. A module that return the MyModule class.
 * ------------------------------------------------------------------------------------------------ */
function MyModel() {
    this.name = "a name";
};

MyModel.prototype.getName = function () {
   return this.name;
};

module.exports = MyModel;