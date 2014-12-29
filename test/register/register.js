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
            test.expect(1);

            essencejs.register("test", { });
            test.equal(essencejs.isRegistered("test"), true, "Expected the `test` key to return true");
            test.done();
        },
    "Register a Class constructor without a key":
        function (test) {
            test.expect(1);

            var TestClass = function TestClass() { };

            essencejs.register(TestClass);

            test.equal(essencejs.isRegistered("TestClass"), true, "Expected the `TestClass` key to return true");
            test.done();
        },
    "Register using a namespace in the key":
        function (test) {
            test.expect(1);

            var TestClass = function TestClass() { };

            essencejs.register("Classes__TestClass", TestClass);

            test.equal(essencejs.isRegistered("TestClass", "Classes"), true, "Expected the `TestClass` key to return true");
            test.done();
        },
    "Register using a namespace in the config object":
        function (test) {
            test.expect(1);

            var TestClass = function TestClass() { };

            essencejs.register("TestClass", TestClass, { namespace : "Classes" });

            test.equal(essencejs.isRegistered("TestClass", "Classes"), true, "Expected the `TestClass` key to return true");
            test.done();
        },
    "Config namespace value should replace key defined namespace":
        function (test) {
            test.expect(2);

            var TestClass = function TestClass() { };

            essencejs.register("Stuff__TestClass", TestClass, { namespace : "Classes" });

            test.equal(essencejs.isRegistered("TestClass", "Classes"), true, "Expected the `TestClass` key to return true");
            test.equal(essencejs.isRegistered("TestClass", "Stuff"), false, "Expected the `TestClass` key to return false");
            test.done();
        },
    "Remove an object registered against a given key":
        function (test) {
            test.expect(1);
            essencejs.register("test", { });

            essencejs.remove("test");

            test.equal(essencejs.isRegistered("test"), false);

            test.done();
        },
    "Remove an object registered against a given key in a given namespace":
        function (test) {
            test.expect(1);
            essencejs.register("test", { }, { namespace : "objects" });

            essencejs.remove("test", "objects");

            test.equal(essencejs.isRegistered("test"), false);

            test.done();
        },
    "Remove an object registered against a given key in a given namespace provided as an array":
        function (test) {
            test.expect(1);
            essencejs.register("test", { }, { namespace : "objects" });

            essencejs.remove("test", ["objects"]);

            test.equal(essencejs.isRegistered("test"), false);

            test.done();
        },
    "Should not Remove an object registered against a given key and namespace without specifying the namespace to remove from":
        function (test) {
            test.expect(1);
            essencejs.register("test", { }, { namespace : "objects" });

            essencejs.remove("test");

            test.equal(essencejs.isRegistered("test"), true);

            test.done();
        }
};