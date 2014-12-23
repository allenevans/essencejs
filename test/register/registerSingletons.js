/*
 * File         :   registerSingletons.js
 * Description  :   TEST register singletons method.
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
    "Should be able to register all files matching the pattern as singletons":
        function (test) {
            test.expect(8);

            essencejs.registerSingletons("test/register/sample/**/*.js", null, function (err) {
                var keys = essencejs.getKeys();

                test.equal(!!err, false);
                test.equal(keys.length > 0, true);
                test.equal(keys.indexOf("now") >= 0, true);
                test.equal(keys.indexOf("myModel") >= 0, true);

                essencejs.inject(function (now, myModel) {
                    test.equal(now instanceof Date, true);
                    test.equal(!!myModel, true);
                    test.equal(myModel.name, "a name");
                }, function (err) {
                    test.equal(!!err, false);
                    test.done();
                });
            });
        },
    "Should be able to register all files matching the pattern as singletons without options":
        function (test) {
            test.expect(8);

            essencejs.registerSingletons("test/register/sample/**/*.js", function (err) {
                var keys = essencejs.getKeys();

                test.equal(!!err, false);
                test.equal(keys.length > 0, true);
                test.equal(keys.indexOf("now") >= 0, true);
                test.equal(keys.indexOf("myModel") >= 0, true);

                essencejs.inject(function (now, myModel) {
                    test.equal(now instanceof Date, true);
                    test.equal(!!myModel, true);
                    test.equal(myModel.name, "a name");
                }, function (err) {
                    test.equal(!!err, false);
                    test.done();
                });
            });
        }
};