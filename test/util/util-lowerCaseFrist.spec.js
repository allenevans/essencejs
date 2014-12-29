/*
 * File         :   util-lowerCaseFirst.js
 * Description  :   TEST util lowerCaseFirst method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    util = require(path.join(process.cwd(), "src/util.js"));

module.exports = {
    "Should convert first character of a string into its lowercase representation":
        function (test) {
            var str = "Abc";

            var result = util.lowerCaseFirst(str);

            test.equal(result, "abc", "String was not transformed correctly.");

            test.expect(1);
            test.done();
        },
    "Should only convert first character of a string into its lowercase representation":
        function (test) {
            var str = "ABC";

            var result = util.lowerCaseFirst(str);

            test.equal(result, "aBC", "String was not transformed correctly.");

            test.expect(1);
            test.done();
        },
    "Should not alter string if first character is already lowercase":
        function (test) {
            var str = "aBC";

            var result = util.lowerCaseFirst(str);

            test.equal(result, "aBC", "String was not transformed correctly.");

            test.expect(1);
            test.done();
        }
};
