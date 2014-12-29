/*
 * File         :   index.js
 * Description  :   TEST exported essence js namespace.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "Should export the essence js library":
        function (test) {
            test.expect(7);

            var essencejsExports = require(path.join(process.cwd(), "index"));

            test.equal(!!essencejsExports, true);
            test.equal(!!essencejsExports.EssenceJs, true);
            test.equal(!!essencejsExports.Config, true);
            test.equal(!!essencejsExports.Registration, true);
            test.equal(!!essencejsExports.Resolvable, true);
            test.equal(!!essencejsExports.parser, true);
            test.equal(!!essencejsExports.util, true);

            test.done();
        }
};