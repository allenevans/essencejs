/*
 * File         :   unresolved.spec.js
 * Description  :   TEST when injecting into a function with dependencies that cannot be resolved.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    ResolveError = require(path.join(process.cwd(), "src/ResolveError")),
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(process.cwd()).EssenceJs)();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Should raise an event when waiting for a dependency to be resolved":
        function (test) {
            test.expect(4);

            var timeout = 9;

            var testWaitingFunction = function () { return 123; };

            essencejs.on("waiting", function (key) {
                test.equal(!!key, true);
                test.equal(key, "testWaitingFunction");
            });

            setTimeout(function () {
                // delayed registration of testWaitingFunction.
                essencejs.factory("testWaitingFunction", testWaitingFunction);
            }, 1);

            essencejs.resolveArgs(["testWaitingFunction"], null, timeout, null, function (err, args) {
                test.equal(!!err, false);
                test.equal(args[0], 123);

                test.done();
            });
        }
};