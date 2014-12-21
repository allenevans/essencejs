/*
 * File         :   Registration-add.js
 * Description  :   TEST Registration class add method tests.
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
    "Should not be able to add a non-Resolvable instance to the registration":
        function (test) {
            test.expect(1);

            var registration = new Registration();

            test.throws(function () {
                registration.add({});
            }, "Argument `resolvable` MUST be an instance of Resolvable");

            test.done();
        },
    "Should not be able to add a non-named resolvable instance to the registration":
        function (test) {
            test.expect(1);

            var registration = new Registration();

            test.throws(function () {
                registration.add(new Resolvable());
            }, "Resolvable must be given a name before it can be registered");

            test.done();
        },
    "Should be able to add a resolvable instance to the registration":
        function (test) {
            test.expect(1);

            var registration = new Registration(),
                resolvable = new Resolvable({
                    name : "test",
                    item : 123
                });

            registration.add(resolvable);

            test.equal(registration.dictionary["test"], resolvable);

            test.done();
        }
};