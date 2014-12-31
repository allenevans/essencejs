/*
 * File         :   inject.spec.js
 * Description  :   TEST exported inject method
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
    tearDown : function (callback) {
        essencejs.dispose();
        callback();
    },
    "Should execute immediately if no arguments":
        function (test) {
            var timeout = createTimeout(test, 1);
            test.expect(2);

            essencejs.inject(function () { return 1; }, function callback(err, result) {
                test.equal(!!err, false, "Error should not exist");
                test.equal(result, 1, "Function should have returned a result in the callback");
                test.done();

                clearTimeout(timeout);
            });
        },
    "Should timeout if arguments cannot be resolved":
        function (test) {
            var timeout = setTimeout(function timeout() { test.done(); }, 1000);

            essencejs.config.timeout = 1;
            test.expect(1);

            essencejs.inject(function (neverResolveArg) { }, function callback(err) {
                test.ok(err);
                test.done();

                clearTimeout(timeout);
            });
        }
};