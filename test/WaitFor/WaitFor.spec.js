/*
 * File         :   WaitFor.js
 * Description  :   TEST WaitFor class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "WaitFor should be exported":
        function (test) {
            test.expect(2);

            var WaitFor = require(path.join(process.cwd(), "src/WaitFor.js"));

            test.equal(!!WaitFor, true, "Expected to be able to require WaitFor");
            test.equal(WaitFor.name, "WaitFor", "Expected name to be `WaitFor`");

            test.done();
        },
    "WaitFor callback should always be set to a function":
        function (test) {
            test.expect(4);

            var WaitFor = require(path.join(process.cwd(), "src/WaitFor.js"));

            var waitFor1 = new WaitFor(),
                waitFor2 = new WaitFor({
                    callback : null
                });

            test.equal(typeof waitFor1.callback === "function", true);
            test.equal(typeof waitFor2.callback === "function", true);
            test.equal(waitFor1.callback(), undefined);
            test.equal(waitFor2.callback(), undefined);

            test.done();
        }
};