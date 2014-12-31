/*
 * File         :   event-listeners.spec.js
 * Description  :   TEST when injecting into a function with dependencies that cannot be resolved.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    CancelError = require(path.join(process.cwd(), "src/CancelError")),
    ResolveError = require(path.join(process.cwd(), "src/ResolveError")),
    EssenceJs = require(path.join(process.cwd(), "index")).EssenceJs,
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new EssenceJs();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Can add an event listener":
        function (test) {
            test.expect(1);

            var listener = essencejs.on("resolveError", function () { });

            test.equal(!!listener, true);
            test.done();
        },
    "Can add a once only event listener":
        function (test) {
            test.expect(1);

            var listener = essencejs.once("resolveError", function () { });

            test.equal(!!listener, true);
            test.done();
        },
    "Can remove an event listener":
        function (test) {
            test.expect(2);

            var func = function () { };
            var listener = essencejs.on("resolveError", func);
            var result = essencejs.removeListener("resolveError", func);

            test.equal(!!listener, true);
            test.equal(!!result, true);
            test.done();
        },
    "Can list the event listeners for the given event":
        function (test) {
            test.expect(2);

            essencejs.on("resolveError", function () {});
            essencejs.once("resolveError", function () {});

            var listeners = essencejs.listeners("resolveError");

            test.equal(!!listeners, true);
            test.equal(listeners.length, 2);
            test.done();
        },
    "Raises a registered event when a new item is registered":
        function (test) {
            test.expect(2);

            essencejs.on("registered", function (registered) {
                test.equals(!!registered, true);
                test.equals(registered.key, "myDependency");
                test.done();
            });

            essencejs.register("myDependency", {});
        },
    "Raises a registered event when a new singleton is registered":
        function (test) {
            test.expect(2);

            essencejs.on("registered", function (registered) {
                test.equals(!!registered, true);
                test.equals(registered.key, "mySingleton");
                test.done();
            });

            essencejs.register("mySingleton", function () { return 123; });
        },
    "Raises a registered event when a new factory is registered":
        function (test) {
            test.expect(2);

            essencejs.on("registered", function (registered) {
                test.equals(!!registered, true);
                test.equals(registered.key, "myFactory");
                test.done();
            });

            essencejs.factory("myFactory", function () { return 123; });
        },
    "Raises a disposing event when the container is being disposed of":
        function (test) {
            test.expect(1);

            var tempEssenceJs = new EssenceJs();

            tempEssenceJs.on("disposing", function (container) {
                test.equals(tempEssenceJs, container);
                test.done();
            });

            tempEssenceJs.dispose();
        },
    "Should raise a 'cancelled' event when cancelling a dependency that is yet to be resolved":
        function (test) {
            var testObject = { a : 1 },
                testObject2 = { b : 2 },
                testObject3 = { c : 3 };

            essencejs.register("testObject", testObject);
            essencejs.register("testObject3", testObject3);

            setTimeout(function () {
                // cancel anything waiting for testObject2 to be resolved.
                essencejs.register("testObject2", undefined);
            }, 1);

            test.expect(3);

            essencejs.on("cancelled", function (err) {
                test.equal(!!err, true);
                test.equal(err instanceof CancelError, true);
                test.equal(err.message, "Cancelled testObject2.");
                test.done();
            });

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], null, 50, null, function (err, args) { });
        }
};