/*
 * File         :   $factory-reference.spec.js
 * Description  :   TEST injection method testing $factory.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    "setUp" : function (callback) {
        essencejs = new (require(path.join(process.cwd(), "index")).EssenceJs)();
        callback();
    },
    "tearDown" : function (callback) {
        essencejs.dispose();
        callback();
    },
    "Should be able to inject $factory into function":
        function (test) {
            test.expect(2);

            var AFactory = function AFactory() {};

            essencejs.inject(function ($factory) {
                test.equal(!!$factory, true);

                $factory(AFactory);
                test.equal(essencejs.isRegistered("aFactory"), true);
                test.done();
            });
        }
};