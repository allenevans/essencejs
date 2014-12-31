/*
 * File         :   can-require-essence.spec.js
 * Description  :   TEST exported EssenceJs class.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

module.exports = {
    "Can require essencejs"
        : function (test) {
        var EssenceJs,
            essencejs,
            error,

            path = require("path");

        try {
            EssenceJs = require(path.join(process.cwd(), "src/EssenceJs"));
            essencejs = new EssenceJs();
        } catch (x) {
            error = x;
        }

        test.ok(essencejs, "Failed to require essencejs.");
        test.ok(essencejs.inject, "Has an inject method.");
        test.ifError(error);

        test.expect(3);
        test.done();
    }
};
