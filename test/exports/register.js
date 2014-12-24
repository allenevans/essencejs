/*
 * File         :   register.js
 * Description  :   TEST exported register method.
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
    "Register an object against a given key":
        function (test) {
            essencejs.register("test", { });

            test.equal(essencejs.isRegistered("test"), true, "Expected the `test` key to return true");
            test.expect(1);
            test.done();
        },
    "Register a Class constructor without a key":
        function (test) {
            var TestClass = function TestClass() { };

            essencejs.register(TestClass);

            test.equal(essencejs.isRegistered("TestClass"), true, "Expected the `TestClass` key to return true");
            test.expect(1);
            test.done();
        }
};