/*
 * File         :   util-isObjectConstructor.spec.js
 * Description  :   TEST util isObjectConstructor method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    util = require(path.join(process.cwd(), "src/util.js"));

module.exports = {
    "Should detect if function is a class constructor by naming convention":
        function (test) {
            var Obj = function Obj() {
                this.prop = null;
            };

            var result = util.isObjectConstructor(Obj);

            test.equal(result, true, "Obj was not detected correctly as a Class to be instantiated.");

            test.expect(1);
            test.done();
        },

    "Should detect if function is a class constructor by prototype methods":
        function (test) {
            var Obj = function () {
                this.prop = null;
            };

            Obj.prototype.aMethod = function () { };

            var result = util.isObjectConstructor(Obj);

            test.equal(result, true, "Obj was not detected correctly as a Class to be instantiated.");

            test.expect(1);
            test.done();
        },

    "Should detect if function is not class constructor":
        function (test) {
            function myFunction() {}

            var result = util.isObjectConstructor(myFunction);

            test.equal(result, false, "Obj was incorrectly detected as a Class to be instantiated.");

            test.expect(1);
            test.done();
        }

};
