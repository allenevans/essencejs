/*
 * File         :   util-instantiateObject.spec.js
 * Description  :   TEST util instantiateObject method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    util = require(path.join(process.cwd(), "src/util.js"));

module.exports = {
    "Should create a new instance of the class":
        function (test) {
            var MyClass = function MyClass() {
                this.value = 123;
            };

            var result = util.instantiateObject(MyClass);

            test.expect(3);

            test.equal(!!result, true, "Failed to create an instance of MyClass.");
            test.equal(result instanceof MyClass, true, "Result was not an instance of MyClass.");
            test.equal(result.value, 123, "Unable to get value from instance of MyClass.");

            test.done();
        },
    "Should create a new instance of the class which takes parameters into the constructor":
        function (test) {
            var MyClass = function MyClass() {
                this.value = 123;
            };

            var result = util.instantiateObject(MyClass);

            test.expect(3);

            test.equal(!!result, true, "Failed to create an instance of MyClass.");
            test.equal(result instanceof MyClass, true, "Result was not an instance of MyClass.");
            test.equal(result.value, 123, "Unable to get value from instance of MyClass.");

            test.done();
        }
};
