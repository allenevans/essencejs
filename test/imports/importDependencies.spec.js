/*
 * File         :   importDependencies.spec.js
 * Description  :   TEST the importing of dependencies.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(process.cwd()).EssenceJs)();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "Should import the all classes even if they share dependencies between them":
        function (test) {
            test.expect(8);

            essencejs.imports("./test/imports/sample2/**/*.js", {
                namespace : "classes"
            }, function (err, result) {
                test.equal(!!err, false);
                test.equal(Array.isArray(result), true);
                test.equal(result.length, 2);
                test.equal(result[0].name, "AClass");
                test.equal(result[1].name, "ConfigClass");
                test.equal(essencejs.isRegistered("AClass"), true);
                test.equal(essencejs.isRegistered("ConfigClass"), true);

                essencejs.inject(function (AClass) {
                    test.equal((new AClass()).value, 123);
                    test.done();
                });
            });
        }
};