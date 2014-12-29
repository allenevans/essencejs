/*
 * File         :   resolveArgs.js
 * Description  :   TEST exported resolveArgs method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    CancelError = require(path.join(process.cwd(), "src/CancelError")),
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
    "Resolve arguments for an object reference":
        function (test) {
            var testObject = { a : 1 };

            essencejs.register("test", testObject);
            test.expect(3);

            essencejs.resolveArgs(["test"], null, null, null, function (err, args) {
                test.equal(!!err, false);
                test.ok(args, "Expected array containing the instance of the test object.");
                test.equal(args[0], testObject, "Test object was not correctly retrieved.");
                test.done();
            });
        },
    "Timeout resolving argument that does not exist":
        function (test) {
            var testObject = { a : 1 };

            essencejs.register("test", testObject);
            test.expect(4);

            essencejs.resolveArgs(["test", "argThatWillNeverExist"], null, 50, null, function (err, args) {
                test.equal(!!err, true);
                test.ok(err.unresolved, "Expected array containing the instance of the test object, and an undefined reference.");
                test.equal(err.unresolved.length > 0, true);
                test.equal(err.unresolved[0], "argThatWillNeverExist");
                test.done();
            });
        },
    "Resolve second argument out of two with delayed registration":
        function (test) {
            var testObject = { a : 1 },
                testObject2 = { b : 2 };

            essencejs.register("testObject", testObject);
            setTimeout(function () {
                essencejs.register("testObject2", testObject2);
            }, 1);

            test.expect(3);

            essencejs.resolveArgs(["testObject", "testObject2"], null, 50, null, function (err, args) {
                test.equal(!!err, false);
                test.equal(args[0], testObject, "First test object was not correctly retrieved.");
                test.equal(args[1], testObject2, "Second test object was not correctly retrieved.");
                test.done();
            });
        },
    "Resolve second argument out of three with delayed registration":
        function (test) {
            var testObject = { a : 1 },
                testObject2 = { b : 2 },
                testObject3 = { c : 3 };

            essencejs.register("testObject", testObject);
            setTimeout(function () {
                essencejs.register("testObject2", testObject2);
            }, 1);
            essencejs.register("testObject3", testObject3);

            test.expect(4);

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], null, 50, null, function (err, args) {
                test.equal(!!err, false);
                test.equal(args[0], testObject, "First test object was not correctly retrieved.");
                test.equal(args[1], testObject2, "Second test object was not correctly retrieved.");
                test.equal(args[2], testObject3, "Third test object was not correctly retrieved.");
                test.done();
            });
        },
    "Resolve first argument out of three with delayed registration":
        function (test) {
            var testObject = { a : 1 },
                testObject2 = { b : 2 },
                testObject3 = { c : 3 };

            setTimeout(function () {
                essencejs.register("testObject", testObject);
            }, 1);
            essencejs.register("testObject2", testObject2);
            essencejs.register("testObject3", testObject3);

            test.expect(4);

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], null, 50, null, function (err, args) {
                test.equal(!!err, false);
                test.equal(args[0], testObject, "First test object was not correctly retrieved.");
                test.equal(args[1], testObject2, "Second test object was not correctly retrieved.");
                test.equal(args[2], testObject3, "Third test object was not correctly retrieved.");
                test.done();
            });
        },
    "Resolve using an override for an existing definition":
        function (test) {
            var testObject = { a : 1 },
                testObject2 = { b : 2 },
                testObject3 = { c : 3},
                testObject4 = { d : 4},

                overrides = {
                    testObject2 : testObject4
                };

            essencejs.register("testObject", testObject);
            essencejs.register("testObject2", testObject2);
            essencejs.register("testObject3", testObject3);

            test.expect(4);

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], null, null, overrides, function (err, args) {
                test.equal(!!err, false);
                test.equal(args[0], testObject, "First test object was not correctly retrieved.");
                test.equal(args[1], testObject4, "Second test object was not correctly retrieved using override.");
                test.equal(args[2], testObject3, "Third test object was not correctly retrieved.");
                test.done();
            });
        },
    "Resolve arguments but cancel the resolution by registering undefined as the outstanding argument":
        function (test) {
            var testObject = { a : 1 },
                testObject2 = { b : 2 },
                testObject3 = { c : 3 };

            essencejs.register("testObject", testObject);

            setTimeout(function () {
                try {
                    essencejs.register("testObject2", testObject2);
                } catch (x) {
                    // ignore any exception caused by test tearing down essencejs then this trying to register
                    // something against it.
                }
            }, 99);

            essencejs.register("testObject3", testObject3);

            setTimeout(function () {
                // cancel anything waiting for testObject2 to be resolved.
                essencejs.register("testObject2", undefined);
            }, 1);

            test.expect(3);

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], null, 50, null, function (err, args) {
                test.equal(!!err, true);
                test.equal(err instanceof CancelError, true);
                test.equal(err.message, "Cancelled.");
                test.done();
            });
        },
    "Two outstanding deferred resolutions at the same time":
        function (test) {
            var testObject = { a : 1 },
                testObject2 = { b : 2 },
                testObject3 = { c : 3 },
                testObject4 = { d : 4 },

                r1 = null,
                r2 = null,
                r3 = null,
                r4 = null;

            essencejs.register("testObject", testObject);
            essencejs.register("testObject2", testObject2);
            setTimeout(function () {
                essencejs.register("testObject3", testObject3);
            }, 9);
            setTimeout(function () {
                essencejs.register("testObject4", testObject4);
            }, 9);

            test.expect(4);

            var resolve1Finished = false,
                resolve2Finished = false,
                resolveCheck;

            resolveCheck = setInterval(function () {
                    if (resolve1Finished && resolve2Finished) {
                        clearInterval(resolveCheck);

                        // test finished.
                        test.equal(r1, testObject);
                        test.equal(r2, testObject2);
                        test.equal(r3, testObject3);
                        test.equal(r4, testObject4);

                        test.done();
                    }
                }, 10);

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], null, 50, null, function (err, args) {
                r1 = args[0];
                r2 = args[1];
                r3 = args[2];

                resolve1Finished = true;
            });

            essencejs.resolveArgs(["testObject", "testObject2", "testObject4"], null, 50, null, function (err, args) {
                r1 = args[0];
                r2 = args[1];
                r4 = args[2];

                resolve2Finished = true;
            });
        },
    "Resolve arguments immediately providing undefined for unresolvable references":
        function (test) {
            var testObject = { a : 1 },
                testObject2 = { b : 2 },
                immediateTimeout = -1;

            essencejs.register("testObject", testObject);
            essencejs.register("testObject2", testObject2);

            test.expect(4);

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], null, immediateTimeout, null, function (err, args) {
                test.equal(!!err, false);
                test.equal(args[0], testObject, "First test object was not correctly retrieved.");
                test.equal(args[1], testObject2, "Second test object was not correctly retrieved.");
                test.equal(args[2] === null, true, "Third, non-existent object should be undefined.");
                test.done();
            });
        },
    "Resolve arguments immediately even if an argument if a nested argument cannot be resolved.":
        function (test) {
            var testNested = function (unresolvableArg) {
                    // because timeout will be -1, this should return true as unresolved arguments are set to null.
                    return unresolvableArg === null;
                },
                testOuter = function (testNested, testObject) { return !!testNested && !!testObject; },
                testObject = { a : 1 },

                immediateTimeout = -1;

            essencejs.factory("testOuter", testOuter);
            essencejs.singleton("testNested", testNested);
            essencejs.register("testObject", testObject);

            test.expect(3);

            essencejs.resolveArgs(["testNested", "testOuter", "testObject"], null, immediateTimeout, null, function (err, args) {
                test.equal(!!err, false);
                test.equal(args[0], true, "Expected first argument in the testOuter function to be the result of evaluating testNested.");
                test.equal(args[2], testObject);
                test.done();
            });
        }
};