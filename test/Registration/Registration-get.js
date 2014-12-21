/*
 * File         :   Registration-get.js
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
                    name : "test",
                    item : 123
                });
            registration.add(resolvable);

            var retrievedResolvable = registration.get("test");

            test.equal(retrievedResolvable, resolvable);

            test.done();
        }
};