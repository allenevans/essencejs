/*
 * File         :   CancelError.js
 * Description  :   TEST Cancel Error class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "CancelError should be exported":
        function (test) {
            var CancelError = require(path.join(process.cwd(), "src/CancelError.js"));

            test.expect(2);

            test.equal(!!CancelError, true, "Expected to be able to require CancelError");
            test.equal(CancelError.name, "CancelError", "Expected name to be `CancelError`");

            test.done();
        },
    "Should be able to set message through CancelError constructor":
        function (test) {
            var CancelError = require(path.join(process.cwd(), "src/CancelError.js"));

            var defaultCancelError = new CancelError();

            var resolveError = new CancelError({
                message : "Oops, something was cancelled."
            });

            test.expect(2);

            test.equal(resolveError.message, "Oops, something was cancelled.");
            test.notEqual(resolveError.message, defaultCancelError.message);

            test.done();
        }
};