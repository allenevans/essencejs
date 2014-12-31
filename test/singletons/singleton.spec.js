/*
 * File         :   singleton.spec.js
 * Description  :   TEST exported singleton method.
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
    "Register a singleton function":
        function (test) {
            var injectedCount = 0;

            function mySingleton () {
                return ++injectedCount;
            }
            test.expect(4);

            essencejs.singleton("mySingleton", mySingleton);

            essencejs.resolveArgs(["mySingleton"], null, null, null, function (err, resolved) {
                test.equal(!!err, false);
                test.equal(resolved.length, 1, "Incorrect number of resolved arguments returned.");
                test.equal(resolved[0], 1, "The instance function registered as a singleton should be the result of a single increment to injectedCount.");
                test.equal(injectedCount, 1);
                test.done();
            });
        },
    "Resolve a singleton function twice":
        function (test) {
            var injectedCount = 0;

            function mySingleton () {
                return ++injectedCount;
            }
            test.expect(4);

            essencejs.singleton("mySingleton", mySingleton);

            essencejs.resolveArgs(["mySingleton"], null, null, null, function () {
                essencejs.resolveArgs(["mySingleton"], null, null, null, function (err, resolved) {
                    test.equal(!!err, false);
                    test.equal(resolved.length, 1, "Incorrect number of resolved arguments returned.");
                    test.equal(resolved[0], 1, "The instance function registered as a singleton should be the result of a single increment to injectedCount.");
                    test.equal(injectedCount, 1);
                    test.done();
                });
            });
        },
    "Register a singleton function with arguments that need to be resolved":
        function (test) {
            var incrementCount = 0;

            function incrementCounter() {
                return ++incrementCount;
            }

            function mySingleton (incrementCounter) {
                return incrementCounter();
            }

            test.expect(4);

            essencejs.singleton("mySingleton", mySingleton);
            essencejs.register("incrementCounter", incrementCounter);

            essencejs.resolveArgs(["mySingleton"], null, null, null, function () {
                essencejs.resolveArgs(["mySingleton"], null, null, null, function (err, resolved) {
                    test.equal(!!err, false);
                    test.equal(resolved.length, 1, "Expected argument to be the return of mySingleton");
                    test.equal(resolved[0], 1, "Expected argument to be the result of executing mySingleton");
                    test.equal(incrementCount, 1);
                    test.done();
                });
            });
        },
    "Register a singleton class with no arguments that need to be resolved":
        function (test) {
            function MySingleton () { }
            test.expect(3);

            essencejs.singleton(MySingleton);

            essencejs.resolveArgs(["mySingleton"], null, null, null, function (err, resolved) {
                test.equal(!!err, false);
                test.equal(resolved.length, 1, "Expected resolved to contain instanceof MySingleton");
                test.equal(resolved[0] instanceof MySingleton, true, "Expected first item in resolved to be an instanceof MySingleton");
                test.done();
            });
        },
    "Register a singleton class in a namespace with no arguments that need to be resolved":
        function (test) {
            function MySingleton () { }
            test.expect(5);

            essencejs.singleton("MySingleton", MySingleton, { namespace : "singletons" });

            test.equal(essencejs.isRegistered("MySingleton", "singletons"), false);
            test.equal(essencejs.isRegistered("mySingleton", "singletons"), true);

            essencejs.resolveArgs(["mySingleton"], null, null, null, function (err, resolved) {
                test.equal(!!err, false);
                test.equal(resolved.length, 1, "Expected resolved to contain instanceof MySingleton");
                test.equal(resolved[0] instanceof MySingleton, true, "Expected first item in resolved to be an instanceof MySingleton");
                test.done();
            });
        },
    "Register a triple nested singleton class instance":
        function (test) {
            var incrementCount = 0;
            var timeout = setTimeout(function timeout() { test.done(); }, 1000);

            function incrementCounter() {
                return ++incrementCount;
            }

            // create classes.
            function Singleton1() { incrementCounter(); }
            function Singleton2(incrementCounter) { incrementCounter(); }
            function Singleton3(singleton1, singleton2) { incrementCounter(); }

            essencejs.singleton(Singleton1);
            essencejs.singleton(Singleton2);
            essencejs.singleton(Singleton3);

            essencejs.register("incrementCounter", incrementCounter);

            test.expect(5);

            essencejs.resolveArgs(["singleton3"], null, null, null, function (err, resolved) {
                test.equal(!!err, false);
                test.equal(resolved.length, 1, "Expected argument to be the instanceof of mySingleton3");
                test.equal(resolved[0] instanceof Singleton3, true, "Expected first item in resolved to be an instanceof Singleton3");
                test.equal(resolved[0] !== Singleton3, true, "Expected first item in resolved to be an instanceof Singleton3, not Singleton3");
                test.equal(incrementCount, 3);

                clearTimeout(timeout);
                test.done();
            });
        }
};