/*
 * File         :   $register-reference.spec.js
 * Description  :   TEST injection method testing $register.
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
    "Should be able to inject $register into function":
        function (test) {
            test.expect(2);

            var AnObject = {};

            essencejs.inject(function ($register) {
                test.equal(!!$register, true);

                $register("AnObject", AnObject);
                test.equal(essencejs.isRegistered("AnObject"), true);
                test.done();
            });
        }
};