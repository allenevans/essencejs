/*
 * File         :   injecting.js
 * Description  :   TEST injecting using namespace.
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
    "Should be able to inject registered object into function using namespace":
        function (test) {
            test.expect(1);

            var myObject = {
                now : new Date(),
                name : "this is my object"
            };

            essencejs.register("my_namespace__myObject", myObject);

            essencejs.inject(function (my_namespace__myObject) {
                test.equal(my_namespace__myObject, myObject);
                test.done();
            });
        },
    "Should find object from global namespace":
        function (test) {
            test.expect(1);

            var _myObject_ = {
                now : new Date(),
                name : "this is my object"
            };

            essencejs.register("my_namespace__myObject", _myObject_);

            essencejs.inject(function (myObject) {
                test.equal(myObject, _myObject_);
                test.done();
            }, { timeout : 11 });
        },
    "Should throw error if trying to resolve dependency from global when ambiguities exist":
        function (test) {
            test.expect(1);

            var _myObject1_ = {
                now : new Date(),
                name : "this is my object 1"
            }, _myObject2_ = {
                now : new Date(),
                name : "this is my object 2"
            };

            essencejs.register("my_namespace1__myObject", _myObject1_);
            essencejs.register("my_namespace2__myObject", _myObject2_);

            test.throws(function () {
                essencejs.inject(function (myObject) {
                    throw "Should not get here because use of global namespace when ambiguities are present";
                },
                { timeout : 1 },
                function (err) {
                    test.equal(!!err, true);
                    test.done();
                });
            }, "Ambiguous");

            test.done();
        },
    "Should find object using specified namespace":
        function (test) {
            test.expect(1);

            var _myObject_ = {
                now : new Date(),
                name : "this is my object"
            };

            essencejs.register("my_namespace__myObject", _myObject_);

            essencejs.inject(function (myObject) {
                test.equal(myObject, _myObject_);
                test.done();
            }, { timeout : 1, namespaces : ["my_namespace"] });
        },
    "Should not find object using different namespace":
        function (test) {
            test.expect(1);

            var _myObject_ = {
                now : new Date(),
                name : "this is my object"
            };

            essencejs.register("my_namespace__myObject", _myObject_);

            essencejs.inject(function (myObject) {
                throw "myObject should not be returned when specifying a different namespace"
            },
                { timeout : 1, namespaces : ["other_namespace"] },
                function (err) {
                    test.equal(!!err, true);
                    test.done();
                });
        },
    "Should resolve objects from one or more namespaces using global search":
        function (test) {
            test.expect(2);

            var _myObject1_ = {
                now : new Date(),
                name : "this is my object 1"
            }, _myObject2_ = {
                now : new Date(),
                name : "this is my object 2"
            };

            essencejs.register("my_namespace1__myObject1", _myObject1_);
            essencejs.register("my_namespace2__myObject2", _myObject2_);

            essencejs.inject(function (myObject1, myObject2) {
                test.equal(myObject1, _myObject1_);
                test.equal(myObject2, _myObject2_);
                test.done();
            },
            { timeout : 1 });
        },
    "Should resolve objects from one or more namespaces using namespace search":
        function (test) {
            test.expect(2);

            var _myObject1_ = {
                now : new Date(),
                name : "this is my object 1"
            }, _myObject2_ = {
                now : new Date(),
                name : "this is my object 2"
            };

            essencejs.register("my_namespace1__myObject1", _myObject1_);
            essencejs.register("my_namespace2__myObject2", _myObject2_);

            essencejs.inject(function (myObject1, myObject2) {
                test.equal(myObject1, _myObject1_);
                test.equal(myObject2, _myObject2_);
                test.done();
            }, {
                timeout : 1,
                namespaces : [
                    "my_namespace1",
                    "my_namespace2"
                ] });
        },
    "Should be able to inject registered singleton into function using namespace":
        function (test) {
            test.expect(2);

            function MySingleton () { }

            essencejs.singleton("my_namespace__MySingleton", MySingleton);

            essencejs.inject(function (my_namespace__mySingleton, mySingleton) {
                test.equal(my_namespace__mySingleton instanceof MySingleton, true);
                test.equal(mySingleton instanceof MySingleton, true);
                test.done();
            }, { timeout : 1 }, function (err) { if (err) { console.error(err.resolveStack); throw err.message; }});
        },
    "Should be able to inject registered factory into function using namespace":
        function (test) {
            test.expect(2);

            function MyFactory () { }

            essencejs.factory("my_namespace__MyFactory", MyFactory);

            essencejs.inject(function (my_namespace__myFactory, myFactory) {
                test.equal(my_namespace__myFactory instanceof MyFactory, true);
                test.equal(myFactory instanceof MyFactory, true);
                test.done();
            }, { timeout : 1 }, function (err) { if (err) { console.error(err.resolveStack); throw err.message; }});
        }
};