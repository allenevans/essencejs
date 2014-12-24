/*
 * File         :   resolveArgs.js
 * Description  :   TEST exported resolveArgs method.
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
    "Resolve arguments for an object reference":
        function (test) {
            var testObject = { a : 1 };

            essencejs.register("test", testObject);
            test.expect(3);

            essencejs.resolveArgs(["test"], null, null, function (err, args) {
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
            test.expect(2);

            essencejs.resolveArgs(["test", "argThatWillNeverExist"], 50, null, function (err, args) {
                test.equal(!!err, true);
                test.ok(args, "Expected array containing the instance of the test object, and an undefined reference.");
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

            essencejs.resolveArgs(["testObject", "testObject2"], 50, null, function (err, args) {
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

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], 50, null, function (err, args) {
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

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], 50, null, function (err, args) {
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

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], null, overrides, function (err, args) {
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
                testObject3 = { c : 3};

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

            test.expect(2);

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], 50, null, function (err, args) {
                test.equal(!!err, true);
                test.equal("Cancelled", err);
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

            essencejs.resolveArgs(["testObject", "testObject2", "testObject3"], 50, null, function (err, args) {
                r1 = args[0];
                r2 = args[1];
                r3 = args[2];

                resolve1Finished = true;
            });

            essencejs.resolveArgs(["testObject", "testObject2", "testObject4"], 50, null, function (err, args) {
                r1 = args[0];
                r2 = args[1];
                r4 = args[2];

                resolve2Finished = true;
            });
        }
};