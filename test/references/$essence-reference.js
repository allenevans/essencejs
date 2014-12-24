/*
 * File         :   $essence-reference.js
 * Description  :   TEST injection method testing $essence.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    "setUp" : function (callback) {
        essencejs = new (require(path.join(process.cwd(), "index")).EssenceJs)();
        callback();
    },
    "tearDown" : function (callback) {
        essencejs.dispose();
        callback();
    },
    "Should be able to inject $essence into function":
        function (test) {
            test.expect(2);

            essencejs.inject(function ($essence) { return $essence; }, function callback(err, result) {
                test.equal(!!err, false, "Error should not exist");
                test.equal(result, essencejs, "Function should have returned the same instance of essencejs");
                test.done();
            });
        },
    "Should be able to register with $essence inside an injected function":
        function (test) {
            test.expect(2);

            function whenComplete(waitForValue) {
                return waitForValue;
            }

            function setValue($essence) {
                $essence.register("waitForValue", "abc");
            }

            essencejs.inject(whenComplete, function callback(err, result) {
                test.equal(!!err, false, "Error should not exist");
                test.equal(result, "abc", "whenComplete should have returned the waitForValue `abc`");
                test.done();
            });

            essencejs.inject(setValue);
        }
};