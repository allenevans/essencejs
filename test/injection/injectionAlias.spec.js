/*
 * File         :   timeoutDelay.spec.js
 * Description  :   TEST injection aliases.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(process.cwd()).EssenceJs)();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Should be able to resolve dependency _{name}_ as {name}":
        function (test) {
            var actualTestObject = {};
            test.expect(2);

            essencejs.register("testObject", actualTestObject);

            essencejs.inject(function (testObject, _testObject_) {
                test.equal(testObject, _testObject_);
                test.equal(_testObject_, actualTestObject);
            }, function () {
                test.done();
            });
        },
    "Should be able to resolve dependency __{name}__ as {name}" :
        function (test) {
            var actualTestObject = {};
            test.expect(2);

            essencejs.register("testObject", actualTestObject);

            essencejs.inject(function (testObject, __testObject__) {
                test.equal(testObject, __testObject__);
                test.equal(__testObject__, actualTestObject);
            }, function () {
                test.done();
            });
        },
    "Should not replace any registration where the alias conflicts with the registration key":
        function (test) {
            var actualTestObject = { a : 1 },
                actualTestObject2 = { b : 2 };

            test.expect(3);

            essencejs.register("testObject", actualTestObject);
            essencejs.register("_testObject_", actualTestObject2);

            essencejs.inject(function (testObject, _testObject_) {
                test.notEqual(testObject, _testObject_);
                test.equal(testObject, actualTestObject);
                test.equal(_testObject_, actualTestObject2);
            }, function () {
                test.done();
            });
        }
};