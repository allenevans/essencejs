/*
 * File         :   instance.js
 * Description  :   TEST instance method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(path.join(process.cwd(), "index")).EssenceJs)();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Check that instance prototype is equal to the register prototype method":
        function (test) {
            test.expect(1);

            test.equal(essencejs.instance, essencejs.register);
            test.done();
        },
    "Register something using the instance method":
        function (test) {
            test.expect(1);

            var TestClass = function TestClass() { };

            essencejs.instance(TestClass);

            test.equal(essencejs.isRegistered("TestClass"), true, "Expected the `TestClass` key to return true");
            test.done();
        }
};