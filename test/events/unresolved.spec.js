/*
 * File         :   unresolved.spec.js
 * Description  :   TEST when injecting into a function with dependencies that cannot be resolved.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    ResolveError = require(path.join(process.cwd(), "src/ResolveError")),
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
    "Should raise an event when a resolve error occurs":
        function (test) {
            test.expect(5);

            var timeout = 9;

            var testNested = function testNested(testObject) {
                    return testObject === undefined ? 123 : 456;
                },
                testOuter = function (testNested) { return testNested; };

            essencejs.factory("testOuter", testOuter);
            essencejs.singleton("testNested", testNested);

            essencejs.inject(function (testOuter) { return testOuter; }, { timeout : timeout }, function () { });

            essencejs.on("resolveError", function (err) {
                test.equal(!!err, true);
                test.equal(err instanceof ResolveError, true);
                test.equal(err.unresolved[0], "testOuter");
                test.equal(err.resolveStack[2].indexOf("[*testObject]") >= 0, true);
                test.equal(essencejs.listeners("resolveError").length, 1);

                test.done();
            });
        },
    "Should raise an event once when a resolve error occurs":
        function (test) {
            test.expect(5);

            var timeout = 9;

            var testNested = function testNested(testObject) {
                    return testObject === undefined ? 123 : 456;
                },
                testOuter = function (testNested) { return testNested; };

            essencejs.factory("testOuter", testOuter);
            essencejs.singleton("testNested", testNested);

            essencejs.inject(function (testOuter) { return testOuter; }, { timeout : timeout }, function () { });

            essencejs.once("resolveError", function (err) {
                test.equal(!!err, true);
                test.equal(err instanceof ResolveError, true);
                test.equal(err.unresolved[0], "testOuter");
                test.equal(err.resolveStack[2].indexOf("[*testObject]") >= 0, true);
                test.equal(essencejs.listeners("resolveError").length, 0);

                test.done();
            });
        }
};