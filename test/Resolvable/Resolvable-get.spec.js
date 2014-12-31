/*
 * File         :   Resolvable-get.spec.js
 * Description  :   TEST Resolvable class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    Resolvable;

module.exports = {
    setUp : function (callback) {
        Resolvable = require(path.join(process.cwd(), "src/Resolvable.js"));
        callback();
    },
    tearDown : function(callback) {
        Resolvable = null;
        callback();
    },
    "Can get item stored in instance of Resolvable":
        function (test) {
            test.expect(2);

            var resolvable = new Resolvable({
                name : "now",
                item : 123
            });

            resolvable.get(null, function (err, value) {
                test.equal(!!err, false);
                test.equal(value, 123);
                test.done()
            });
        }
};