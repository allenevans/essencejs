/*
 * File         :   getKeys.spec.js
 * Description  :   TEST get registration keys method.
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
    "Get a list of registered keys":
        function (test) {
            test.expect(4);

            var TestClass = function TestClass() { };
            essencejs.register(TestClass);

            essencejs.register("test", { });

            var keys = essencejs.getKeys();

            test.equal(keys.length > 0, true);
            test.equal(keys.indexOf("TestClass") >= 0, true);
            test.equal(keys.indexOf("test") >= 0, true);
            test.equal(keys.indexOf("unknown") >= 0, false);

            test.done();
        },
    "Get a list of registered keys for the given namespace":
        function (test) {
            test.expect(5);

            var TestClass1 = function TestClass1() { };
            var TestClass2 = function TestClass2() { };
            essencejs.register("my_namespace__TestClass1", TestClass1);
            essencejs.register("another_namespace__TestClass2", TestClass2);

            essencejs.register("my_namespace__test", { });

            var keys = essencejs.getKeys("my_namespace");

            test.equal(keys.length > 0, true);
            test.equal(keys.indexOf("TestClass1") >= 0, true);
            test.equal(keys.indexOf("TestClass2") >= 0, false);
            test.equal(keys.indexOf("test") >= 0, true);
            test.equal(keys.indexOf("unknown") >= 0, false);

            test.done();
        }
};