/*
 * File         :   objects.js
 * Description  :   TEST register objects as factories.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(path.join(process.cwd(), "index")).EssenceJs)();
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        callback();
    },
    "When object is registered as a factory then a cloned copy of the object should be returned when injected":
        function (test) {
            test.expect(4);

            var origMyObject = {
                now : new Date(),
                name : "this is my object"
            };

            essencejs.factory("myObject", origMyObject);

            essencejs.inject(function (myObject) {
                test.equal(!!myObject, true);
                test.equal(myObject.name, origMyObject.name);

                test.notEqual(myObject.now, origMyObject.now);
                test.notEqual(myObject, origMyObject);

                test.done();
            });
        },
    "Register class instance as a factory":
        function (test) {
            test.expect(5);

            var MyClass = function MyClass(params) {
                this.value = (params && params.value) || null;
            };

            MyClass.prototype.getValue = function getValue() {
                return this.value;
            };

            var origMyClassInstance = new MyClass({ value : "abc" });

            essencejs.factory("myClass", origMyClassInstance);

            essencejs.inject(function (myClass) {
                test.equal(!!myClass, true);
                test.equal(myClass.value, origMyClassInstance.value);
                test.equal(myClass.getValue(), origMyClassInstance.getValue());
                test.equal(myClass instanceof MyClass, true);
                test.notEqual(myClass, origMyClassInstance);

                test.done();
            });
        }
};