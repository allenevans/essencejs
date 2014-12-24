/*
 * File         :   getKeys.js
 * Description  :   TEST get registration keys method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(path.join(process.cwd(), "index")).EssenceJs)();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Get a list of registered keys":
        function (test) {
            test.expect(4);

            var TestClass = function TestClass() { };
            essencejs.register(TestClass);

            essencejs.register("test", { });

            var keys = essencejs.getKeys();

            test.equal(keys.length > 0, true);
            test.equal(keys.indexOf("TestClass") >= 0, true);
            test.equal(keys.indexOf("test") >= 0, true);
            test.equal(keys.indexOf("unknown") >= 0, false);

            test.done();
        }
};