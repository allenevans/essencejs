/*
 * File         :   timeoutImmediate.js
 * Description  :   TEST inject timeout (-1) immediate functionality.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

function createTimeout(test, duration) {
    return setTimeout(function timeout() { test.done(); }, duration);
}

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(path.join(process.cwd(), "index")).EssenceJs)();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Should call the function immediately even if arguments cannot be resolved":
        function (test) {
            test.expect(2);

            var testFunc = function (unresolvableArg) { return unresolvableArg === null ? 123 : 456; };
            essencejs.factory("testFunc", testFunc);

            // although the immediately function should return almost straight away, there may be a very short delay
            // whilst the async functions are processed.
            var timeout = createTimeout(test, 9);

            essencejs.inject(function (testFunc) { return testFunc; }, { timeout : -1 }, function (err, result) {
                test.equal(!!err, false);
                test.equal(result, 123);

                clearTimeout(timeout);

                test.done();
            });
        }
};