/*
 * File         :   MyClass.js
 * Description  :   Sample class module export.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (object1, object2, functionSum) {
    function MyClass() {

    };

    MyClass.prototype.getValue = function getValue() {
        return functionSum(object1.value, object2.value);
    };

    return MyClass;
};