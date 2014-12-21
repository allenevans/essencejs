/*
 * File         :   Registration-remove.js
 * Description  :   TEST Registration class remove method tests.
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
    "Should be able to remove a resolvable instance from the registration":
        function (test) {
            test.expect(1);

            var registration = new Registration(),
                resolvable = new Resolvable({
                    name : "test",
                    item : 123
                });
            registration.add(resolvable);

            registration.remove("test");

            test.equal(registration.dictionary["test"], undefined);

            test.done();
        }
};