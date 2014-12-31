/*
 * File         :   timeoutDelay.spec.js
 * Description  :   TEST inject timeout delay functionality.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

function createTimeout(test, duration) {
    return setTimeout(function timeout() { test.done(); }, duration);
}

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(path.join(process.cwd(), "index")).EssenceJs)();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Should timeout if items cannot be resolved within the given timeout":
        function (test) {
            test.expect(2);

            var timeout = 1,
                registerDelay = 10;

            setTimeout(function () {
                if (!essencejs.isDisposed()) {
                    essencejs.register("testObject", {});
                }
            }, registerDelay);

            essencejs.inject(function (testObject) { return testObject; }, { timeout : timeout}, function (err, result) {
                test.equal(!!err, true);
                test.equal(result, undefined);
                test.done();
            });
        },
    "Should timeout if nested items cannot be resolved within the given timeout":
        function (test) {
            test.expect(2);

            var timeout = 1,
                registerDelay = 10;

            var testNested = function testNested(testObject) {
                    return testObject === undefined ? 123 : 456;
                },
                testOuter = function (testNested) { return testNested; },
                testObject = { a : 1 };

            essencejs.factory("testOuter", testOuter);
            essencejs.singleton("testNested", testNested);

            setTimeout(function () {
                if (!essencejs.isDisposed()) {
                    essencejs.register("testObject", testObject);
                }
            }, registerDelay);

            essencejs.inject(function (testOuter) { return testOuter; }, { timeout : timeout }, function (err, result) {
                test.equal(!!err, true);
                test.equal(result, undefined);

                test.done();
            });
        },
    "Should not timeout if nested items can be resolved within the given timeout":
        function (test) {
            test.expect(2);

            var timeout = 10,
                registerDelay = 1;

            var testNested = function testNested(delayedObject) {
                    return delayedObject === undefined;
                },
                testOuter = function (testNested) {
                    return !!testNested;
                },
                delayedObject = { a : 1 };

            essencejs.factory("testOuter", testOuter);
            essencejs.singleton("testNested", testNested);

            setTimeout(function () {
                if (!essencejs.isDisposed()) {
                    essencejs.register("delayedObject", delayedObject);
                }
            }, registerDelay);

            essencejs.inject(function (testOuter) { return testOuter; }, { timeout : timeout}, function (err, result) {
                test.equal(!!err, false);
                test.equal(result, false);

                test.done();
            });
        }
};