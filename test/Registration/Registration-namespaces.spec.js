/*
 * File         :   Registration-namespaces.spec.js
 * Description  :   TEST Registration class namespaces property tests.
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
    "Should be able to get the list of registered namespaces from the dictionary":
        function (test) {
            test.expect(3);

            var registration = new Registration(),
                resolvable1 = new Resolvable({
                    namespace : "my_namespace1",
                    key : "test",
                    item : 123
                }),
                resolvable2 = new Resolvable({
                    namespace : "my_namespace2",
                    key : "test",
                    item : 456
                });

            registration.add(resolvable1);
            registration.add(resolvable2);

            test.equal(registration.namespaces.length, 2);
            test.equal(registration.namespaces.indexOf("my_namespace1") >= 0, true);
            test.equal(registration.namespaces.indexOf("my_namespace2") >= 0, true);

            test.done();
        }
};