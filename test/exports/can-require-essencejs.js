/**
 * TEST : Can require essencejs.
 */
module.exports = {
    setUp : function (callback) { callback(); },
    tearDown : function (callback) { callback(); },

    "Can require essencejs"
        : function (test) {
        var essencejs,
            error,

            path = require("path");

        try {
            essencejs = require(path.join(process.cwd(), "src/main.js"));
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
