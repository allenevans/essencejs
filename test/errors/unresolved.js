/*
 * File         :   unresolved.js
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
    "Should return an error of type ResolveError if dependencies cannot be resolved in time":
        function (test) {
            test.expect(4);

            var timeout = 1;

            var testNested = function testNested(testObject) {
                    return testObject === undefined ? 123 : 456;
                },
                testOuter = function (testNested) { return testNested; };

            essencejs.factory("testOuter", testOuter);
            essencejs.singleton("testNested", testNested);

            essencejs.inject(function (testOuter) { return testOuter; }, { timeout : timeout }, function (err) {
                test.equal(!!err, true);
                test.equal(err instanceof ResolveError, true);
                test.equal(err.unresolved[0], "testOuter");
                test.equal(err.resolveStack[2].indexOf("[*testObject]") >= 0, true);

                test.done();
            });
        },
    "Should return an error of type ResolveError if dependencies cannot be resolved in time (2)":
        function (test) {
            test.expect(4);

            var timeout = 8,
                registerDelay = 1;

            var now = function now () {
                    return Date.now();
                }, later = function later (now) {
                    return now + 1000;
                },
                testNested = function testNested(now, later, testObject) {
                    return testObject === undefined &&
                        later > now ? now : 456;
                },
                testOuter = function (testNested) { return testNested; };

            essencejs.factory("testOuter", testOuter);
            essencejs.singleton("testNested", testNested);
            essencejs.factory("later", later);

            setTimeout(function () {
                essencejs.factory("now", now);
            }, registerDelay);

            essencejs.inject(function (testOuter) { return testOuter; }, { timeout : timeout }, function (err) {
                test.equal(!!err, true);
                test.equal(err instanceof ResolveError, true);
                test.equal(err.unresolved[0], "testOuter");
                test.equal(err.resolveStack[2].indexOf("[*now, later, *testObject]") >= 0, true);

                test.done();
            });
        }
};