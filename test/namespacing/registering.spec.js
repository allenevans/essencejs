/*
 * File         :   registering.js
 * Description  :   TEST register objects in a namespace.
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
    "Should be able to register something in a namespace":
        function (test) {
            test.expect(1);

            var myObject = {
                now : new Date(),
                name : "this is my object"
            };

            essencejs.register("my_namespace__myObject", myObject);

            var keys = essencejs.getKeys();

            test.equal(keys.indexOf("my_namespace__myObject") >= 0, true);
            test.done();
        },
    "Should be able to register something with a double namespace separator":
        function (test) {
            test.expect(1);

            var myObject = {
                now : new Date(),
                name : "this is my object"
            };

            essencejs.register("my_namespace__my__Object", myObject);

            var keys = essencejs.getKeys();

            test.equal(keys.indexOf("my_namespace__my__Object") >= 0, true);
            test.done();
        },
    "Should be able to register something with the same name in but different objects in different namespaces":
        function (test) {
            test.expect(2);

            var myObject1 = {
                now : new Date(),
                name : "this is my object 1"
            }, myObject2 = {
                now : new Date(),
                name : "this is my object 2"
            };

            essencejs.register("my_namespace1__myObject", myObject1);
            essencejs.register("my_namespace2__myObject", myObject2);

            var keys = essencejs.getKeys();

            test.equal(keys.indexOf("my_namespace1__myObject") >= 0, true);
            test.equal(keys.indexOf("my_namespace2__myObject") >= 0, true);
            test.done();
        }
};