/*
 * File         :   multiple-instances.spec.js
 * Description  :   TEST using multiple instances of essencejs.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    EssenceJs = require(path.join(process.cwd(), "src/EssenceJs")),
    essencejs1,
    essencejs2;

module.exports = {
    "setUp" : function (callback) {
        essencejs1 = new EssenceJs();
        essencejs2 = new EssenceJs();
        callback();
    },
    "tearDown" : function (callback) {
        essencejs1.dispose();
        essencejs2.dispose();
        callback();
    },
    "Different instances of essencejs are not equal to each other":
        function (test) {
            test.expect(1);

            test.notEqual(essencejs1, essencejs2);

            test.done();
        },
    "$essencejs is not equal to $essencejs in different instance":
        function (test) {
            test.expect(3);

            var $essencejs1, $essencejs2;

            function runTests() {
                test.equal(!!$essencejs1, true);
                test.equal(!!$essencejs2, true);
                test.notEqual($essencejs1, $essencejs2);

                test.done();
            }

            essencejs1.inject(function ($essencejs) {
                $essencejs1 = $essencejs;
                essencejs2.inject(function ($essencejs) {
                    $essencejs2 = $essencejs;

                    runTests();
                });
            });
        },
    "Should not be able to inject an item registered in once instance of essancejs using the other instance":
        function (test) {
            test.expect(2);

            essencejs1.register("item", "xyz");

            test.equal(essencejs1.isRegistered("item"), true);
            test.equal(essencejs2.isRegistered("item"), false);

            test.done();
        }
};