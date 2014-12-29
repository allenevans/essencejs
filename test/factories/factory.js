/*
 * File         :   factory.js
 * Description  :   TEST exported factory method.
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
    "Register a factory function":
        function (test) {
            var injectedCount = 0;

            function myFactory () {
                return ++injectedCount;
            }
            test.expect(4);

            essencejs.factory("myFactory", myFactory);

            essencejs.resolveArgs(["myFactory"], null, null, null, function (err, resolved) {
                test.equal(!!err, false);
                test.equal(resolved.length, 1, "Incorrect number of resolved arguments returned.");
                test.equal(resolved[0], 1, "The instance function registered as a factory should be the result of a single increment to injectedCount.");
                test.equal(injectedCount, 1);
                test.done();
            });
        },
    "Resolve a factory function twice":
        function (test) {
            var injectedCount = 0;

            function myFactory () {
                return ++injectedCount;
            }
            test.expect(4);

            essencejs.factory("myFactory", myFactory);

            essencejs.resolveArgs(["myFactory"], null, null, null, function () {
                essencejs.resolveArgs(["myFactory"], null, null, null, function (err, resolved) {
                    test.equal(!!err, false);
                    test.equal(resolved.length, 1, "Incorrect number of resolved arguments returned.");
                    test.equal(resolved[0], 2, "The instance function registered as a factory should be the result of a double increment to injectedCount.");
                    test.equal(injectedCount, 2);
                    test.done();
                });
            });
        },
    "Register a factory function with arguments that need to be resolved":
        function (test) {
            var incrementCount = 0;

            function incrementCounter() {
                return ++incrementCount;
            }

            function myFactory (incrementCounter) {
                return incrementCounter();
            }

            test.expect(4);

            essencejs.factory("myFactory", myFactory);
            essencejs.register("incrementCounter", incrementCounter);

            essencejs.resolveArgs(["myFactory"], null, null, null, function () {
                essencejs.resolveArgs(["myFactory"], null, null, null, function (err, resolved) {
                    test.equal(!!err, false);
                    test.equal(resolved.length, 1, "Expected argument to be the return of myFactory");
                    test.equal(resolved[0], 2, "Expected argument to be the result of executing myFactory");
                    test.equal(incrementCount, 2);
                    test.done();
                });
            });
        },
    "Register a factory class with no arguments that need to be resolved":
        function (test) {
            function MyFactory () { }
            test.expect(3);

            essencejs.factory(MyFactory);

            essencejs.resolveArgs(["myFactory"], null, null, null, function (err, resolved) {
                test.equal(!!err, false);
                test.equal(resolved.length, 1, "Expected resolved to contain instanceof MyFactory");
                test.equal(resolved[0] instanceof MyFactory, true, "Expected first item in resolved to be an instanceof MyFactory");
                test.done();
            });
        },
    "Register a factory class in a namespace with no arguments that need to be resolved":
        function (test) {
            function MyFactory () { }
            test.expect(5);

            essencejs.factory("MyFactory", MyFactory, { namespace : "factories" });

            test.equal(essencejs.isRegistered("MyFactory", "factories"), false);
            test.equal(essencejs.isRegistered("myFactory", "factories"), true);

            essencejs.resolveArgs(["myFactory"], null, null, null, function (err, resolved) {
                test.equal(!!err, false);
                test.equal(resolved.length, 1, "Expected resolved to contain instanceof MyFactory");
                test.equal(resolved[0] instanceof MyFactory, true, "Expected first item in resolved to be an instanceof MyFactory");
                test.done();
            });
        },
    "Register a factory class with arguments that need to be resolved":
        function (test) {
            var nowTestValue,
                nowCallCount = 0;

            function now() {
                nowTestValue = Date.now();
                nowCallCount++;

                return nowTestValue;
            }

            function MyFactory (now) {
                this.now = now;
            }

            test.expect(6);

            essencejs.factory(MyFactory);
            essencejs.factory(now);

            essencejs.resolveArgs(["myFactory"], null, null, null, function (err, resolved) {
                test.equal(!!err, false);
                test.equal(resolved.length, 1, "Expected resolved to contain instanceof MyFactory");
                test.equal(resolved[0] instanceof MyFactory, true, "Expected first item in resolved to be an instanceof MyFactory");
                test.equal(!!nowTestValue, true, "now function was not called");
                test.equal(resolved[0].now, nowTestValue, "MyFactory.now property not set correctly in constructor");
                test.equal(nowCallCount, 1, "now function should have only been called once");
                test.done();
            });
        }
};