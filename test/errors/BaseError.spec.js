/*
 * File         :   BaseError.spec.js
 * Description  :   TEST Base Error class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "BaseError should be exported":
        function (test) {
            var BaseError = require(path.join(process.cwd(), "src/BaseError.js"));

            test.expect(2);

            test.equal(!!BaseError, true, "Expected to be able to require BaseError");
            test.equal(BaseError.name, "BaseError", "Expected name to be `BaseError`");

            test.done();
        },
    "Should be able to set message through BaseError constructor":
        function (test) {
            var BaseError = require(path.join(process.cwd(), "src/BaseError.js"));

            var defaultBaseError = new BaseError();

            var baseError = new BaseError({
                message : "Ooops, something went wrong."
            });

            test.expect(2);

            test.equal(baseError.message, "Ooops, something went wrong.");
            test.notEqual(baseError.message, defaultBaseError.message);

            test.done();
        }
};