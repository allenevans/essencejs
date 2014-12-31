/*
 * File         :   Registration.spec.js
 * Description  :   TEST Registration class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "Registration should be exported":
        function (test) {
            var Registration = require(path.join(process.cwd(), "src/Registration.js"));

            test.expect(2);

            test.equal(!!Registration, true, "Expected to be able to require Registration");
            test.equal(Registration.name, "Registration", "Expected name to be `Registration`");

            test.done();
        }
};