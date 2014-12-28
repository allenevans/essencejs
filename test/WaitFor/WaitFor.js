/*
 * File         :   WaitFor.js
 * Description  :   TEST WaitFor class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "WaitFor should be exported":
        function (test) {
            var WaitFor = require(path.join(process.cwd(), "src/WaitFor.js"));

            test.expect(2);

            test.equal(!!WaitFor, true, "Expected to be able to require WaitFor");
            test.equal(WaitFor.name, "WaitFor", "Expected name to be `WaitFor`");

            test.done();
        }
};