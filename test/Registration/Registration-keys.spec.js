/*
 * File         :   Registration-keys.spec.js
 * Description  :   TEST Registration class keys property tests.
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
    "Should be able to get the list of registered keys from the dictionary":
        function (test) {
            test.expect(2);

            var registration = new Registration(),
                resolvable = new Resolvable({
                    key : "test",
                    item : 123
                });

            registration.add(resolvable);

            test.equal(registration.keys.length > 0, true);
            test.equal(registration.keys.indexOf("test") >= 0, true);

            test.done();
        }
};