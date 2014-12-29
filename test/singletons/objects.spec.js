/*
 * File         :   objects.js
 * Description  :   TEST register objects as singletons.
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
            test.expect(9);

            var origMyObject = {
                now : new Date(),
                name : "this is my object"
            }, ref1, ref2;

            essencejs.singleton("myObject", origMyObject);

            essencejs.inject(function (myObject) {
                ref1 = myObject;
                essencejs.inject(function (myObject) {
                    ref2 = myObject;
                    test.equal(!!ref1, true);
                    test.equal(!!ref2, true);

                    test.equal(ref1.name, origMyObject.name);
                    test.equal(ref2.name, origMyObject.name);

                    test.notEqual(ref1.now, origMyObject.now);
                    test.notEqual(ref2.now, origMyObject.now);

                    test.notEqual(ref1, origMyObject);
                    test.notEqual(ref2, origMyObject);
                    test.equal(ref1, ref2);

                    test.done();
                });
            });
        },
    "Register class instance as a singleton":
        function (test) {
            test.expect(7);

            var MyClass = function MyClass(params) {
                this.value = (params && params.value) || null;
            };

            MyClass.prototype.getValue = function getValue() {
                return this.value;
            };

            var ref1, ref2;

            var origMyClassInstance = new MyClass({ value : "abc" });

            essencejs.singleton("myClass", origMyClassInstance);

            essencejs.inject(function (myClass) {
                ref1 = myClass;
                essencejs.inject(function (myClass) {
                    ref2 = myClass;
                    test.equal(!!ref1, true);
                    test.equal(!!ref2, true);

                    test.equal(ref1.value, origMyClassInstance.value);
                    test.equal(ref2.value, origMyClassInstance.value);

                    test.notEqual(ref1, origMyClassInstance);
                    test.notEqual(ref2, origMyClassInstance);
                    test.equal(ref1, ref2);

                    test.done();
                });
            });
        }
};