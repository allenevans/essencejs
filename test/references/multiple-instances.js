/*
 * File         :   multiple-instances.js
 * Description  :   TEST using multiple instances of essencejs.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    EssenceJs = require(path.join(process.cwd(), "src/main.js")),
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
    "$essence is not equal to $essence in different instance":
        function (test) {
            test.expect(3);

            var $essence1, $essence2;

            function runTests() {
                test.equal(!!$essence1, true);
                test.equal(!!$essence2, true);
                test.notEqual($essence1, $essence2);

                test.done();
            }

            essencejs1.inject(function ($essence) {
                $essence1 = $essence;
                essencejs2.inject(function ($essence) {
                    $essence2 = $essence;

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