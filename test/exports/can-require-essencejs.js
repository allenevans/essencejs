/**
 * TEST : Can require essencejs.
 */
module.exports = {
    "Can require essencejs"
        : function (test) {
        var EssenceJs,
            essencejs,
            error,

            path = require("path");

        try {
            EssenceJs = require(path.join(process.cwd(), "src/main.js"));
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
