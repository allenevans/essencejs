/*
 * File         :   Registration-get.spec.js
 * Description  :   TEST Registration class get method tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    Resolvable,
    Registration;

module.exports = {
    setUp : function (callback) {
        Resolvable = require(path.join(process.cwd(), "src/Resolvable.js"));
        Registration = require(path.join(process.cwd(), "src/Registration.js"));
        callback();
    },
    tearDown : function(callback) {
        Resolvable = null;
        Registration = null;
        callback();
    },
    "Should be able to get a resolvable instance from the registration":
        function (test) {
            test.expect(1);

            var registration = new Registration(),
                resolvable = new Resolvable({
                    key : "test",
                    item : 123
                });
            registration.add(resolvable);

            var retrievedResolvable = registration.get("test");

            test.equal(retrievedResolvable, resolvable);

            test.done();
        },
    "Should be able to get a resolvable instance from the registration with the given namespace":
        function (test) {
            test.expect(1);

            var registration = new Registration(),
                resolvable = new Resolvable({
                    namespace : "my_namespace",
                    key : "test",
                    item : 123
                });
            registration.add(resolvable);

            var retrievedResolvable = registration.get("test", ["my_namespace"]);

            test.equal(retrievedResolvable, resolvable);

            test.done();
        },
    "Should be able to get a resolvable instance from the registration with the given namespace pass as a string":
        function (test) {
            test.expect(1);

            var registration = new Registration(),
                resolvable = new Resolvable({
                    namespace : "my_namespace",
                    key : "test",
                    item : 123
                });
            registration.add(resolvable);

            var retrievedResolvable = registration.get("test", "my_namespace");

            test.equal(retrievedResolvable, resolvable);

            test.done();
        },
    "Should be able to get a resolvable instance from the registration using the global namespace":
        function (test) {
            test.expect(1);

            var registration = new Registration(),
                resolvable = new Resolvable({
                    namespace : "my_namespace",
                    key : "test",
                    item : 123
                });
            registration.add(resolvable);

            var retrievedResolvable = registration.get("test", []);

            test.equal(retrievedResolvable, resolvable);

            test.done();
        },
    "Should throw an error if an ambiguous get request is made":
        function (test) {
            test.expect(1);

            var registration = new Registration(),
                resolvable1 = new Resolvable({
                    namespace : "my_namespace1",
                    key : "test",
                    item : 123
                }), resolvable2 = new Resolvable({
                    namespace : "my_namespace2",
                    key : "test",
                    item : 123
                });

            registration.add(resolvable1);
            registration.add(resolvable2);

            test.throws(function () {
                registration.get("test", ["my_namespace1", "my_namespace2"]);
            }, "Ambiguous");

            test.done();
        }
};