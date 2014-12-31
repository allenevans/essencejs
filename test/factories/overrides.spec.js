/*
 * File         :   overrides.spec.js
 * Description  :   TEST overrides for factory dependencies.
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
    "Should be able to inject into function with a dependency that can only be resolved using an override":
        function (test) {
            test.expect(1);

            function now(TheDateObject) {
                return TheDateObject.now();
            };

            essencejs.factory("now", now, {
                overrides : {
                    TheDateObject : Date
                }
            });

            essencejs.inject(function (now) {
                test.equal(!!now, true);

                test.done();
            });
        },
    "Should be able to set constructor parameters to null":
        function (test) {
            test.expect(2);

            function MyModel(params) {
                this.name = params && params.name;
            }

            MyModel.prototype.getName = function getName() {
                return this.name;
            };

            essencejs.factory("MyModel", MyModel, {
                overrides: {
                    params: null
                }
            });

            essencejs.inject(function (myModel) {
                test.equal(myModel instanceof MyModel, true);
                test.equal(myModel.name, undefined);
                test.done();
            });
        },
    "Should be able to set constructor parameters":
        function (test) {
            test.expect(2);

            function MyModel(params) {
                this.name = params && params.name;
            }

            MyModel.prototype.getName = function getName() {
                return this.name;
            };

            essencejs.factory("MyModel", MyModel, {
                overrides: {
                    params: { name: "bob" }
                }
            });

            essencejs.inject(function (myModel) {
                test.equal(myModel instanceof MyModel, true);
                test.equal(myModel.getName(), "bob" );
                test.done();
            });
        }
};