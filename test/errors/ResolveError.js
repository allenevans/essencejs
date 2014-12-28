/*
 * File         :   ResolveError.js
 * Description  :   TEST Resolve Error class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "ResolveError should be exported":
        function (test) {
            var ResolveError = require(path.join(process.cwd(), "src/ResolveError.js"));

            test.expect(2);

            test.equal(!!ResolveError, true, "Expected to be able to require ResolveError");
            test.equal(ResolveError.name, "ResolveError", "Expected name to be `ResolveError`");

            test.done();
        },
    "Should be able to set message through ResolveError constructor":
        function (test) {
            var ResolveError = require(path.join(process.cwd(), "src/ResolveError.js"));

            var defaultResolveError = new ResolveError();

            var resolveError = new ResolveError({
                message : "Oops, something went wrong."
            });

            test.expect(2);

            test.equal(resolveError.message, "Oops, something went wrong.");
            test.notEqual(resolveError.message, defaultResolveError.message);

            test.done();
        }
};