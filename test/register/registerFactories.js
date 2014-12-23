/*
 * File         :   registerFactories.js
 * Description  :   TEST register factories method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(path.join(process.cwd(), "src/EssenceJs")))();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Should be able to register all files matching the pattern as factories":
        function (test) {
            test.expect(7);

            essencejs.registerFactories("test/register/factories/**/*.js", null, function (err) {
                var keys = essencejs.getKeys();

                test.equal(!!err, false);
                test.equal(keys.length > 0, true);
                test.equal(keys.indexOf("now") >= 0, true);
                test.equal(keys.indexOf("myModel") >= 0, true);

                essencejs.inject(function (now, myModel) {
                    test.equal(now instanceof Date, true);
                    test.equal(!!myModel, true);
                    test.equal(myModel.name, "name is not defined");
                    test.done();
                }, function (err) {
                    console.error(err);
                });
            });
        }
};