/*
 * File         :   util-variableNameFromFilePath.js
 * Description  :   TEST util variableNameFromFilePath method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    util = require(path.join(process.cwd(), "src/util.js"));

module.exports = {
    "Should get a proper formatted variable name from a sensible file path":
        function (test) {
            test.expect(1);

            var input = "/home/user/models/MyModel.js";

            var result = util.variableNameFromFilePath(input);

            test.equal(result, "MyModel");

            test.done();
        },
    "Should ignore whitespace in the file name":
        function (test) {
            test.expect(1);

            var input = "/home/user/models/My Model.js";

            var result = util.variableNameFromFilePath(input);

            test.equal(result, "MyModel");

            test.done();
        },
    "Should remove any illegal variable name characters":
        function (test) {
            test.expect(1);

            var input = "/home/user/models/My+Model$=(1)%.js";

            var result = util.variableNameFromFilePath(input);

            test.equal(result, "MyModel$1");

            test.done();
        }
};