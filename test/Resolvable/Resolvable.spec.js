/*
 * File         :   Resolvable.spec.js
 * Description  :   TEST Resolvable class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "Resolvable should be exported":
        function (test) {
            var Resolvable = require(path.join(process.cwd(), "src/Resolvable.js"));

            test.expect(2);

            test.equal(!!Resolvable, true, "Expected to be able to require Resolvable");
            test.equal(Resolvable.name, "Resolvable", "Expected name to be `Resolvable`");

            test.done();
        }
};