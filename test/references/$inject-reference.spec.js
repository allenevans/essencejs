/*
 * File         :   $inject-reference.spec.js
 * Description  :   TEST injection method testing $inject.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    "setUp" : function (callback) {
        essencejs = new (require(process.cwd()).EssenceJs)();
        callback();
    },
    "tearDown" : function (callback) {
        essencejs.dispose();
        callback();
    },
    "Should be able to inject $inject into function":
        function (test) {
            test.expect(2);

            var AFactory = function AFactory() {};

            essencejs.inject(function ($inject, $factory) {
                test.equal(!!$inject, true);

                $factory(AFactory);

                $inject(function (aFactory) {
                    test.equal(!!aFactory, true);
                    test.done();
                });
            });
        }
};