/*
 * File         :   $singleton-reference.spec.js
 * Description  :   TEST injection method testing $singleton.
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
    "Should be able to inject $singleton into function":
        function (test) {
            test.expect(2);

            var ASingleton = function ASingleton() {};

            essencejs.inject(function ($singleton) {
                test.equal(!!$singleton, true);

                $singleton(ASingleton);
                test.equal(essencejs.isRegistered("aSingleton"), true);
                test.done();
            });
        }
};