/*
 * File         :   registerByStrategy.spec.js
 * Description  :   TEST register by strategy method.
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
    "Should be able to register all files matching the pattern using the default strategy":
        function (test) {
            test.expect(8);

            essencejs.registerByStrategy("test/register/sample/**/*.js", null, null, function (err) {
                var keys = essencejs.getKeys();

                test.equal(!!err, false);
                test.equal(keys.length > 0, true);
                test.equal(keys.indexOf("now") >= 0, true);
                test.equal(keys.indexOf("MyModel") >= 0, true);

                essencejs.inject(function (now, MyModel) {
                    test.equal(now instanceof Date, false);
                    test.equal(!!MyModel, true);
                    test.equal(MyModel.name, "MyModel");
                }, function (err) {
                    test.equal(!!err, false);
                    test.done();
                });
            });
        },
    "Should be able to register all files matching the pattern using the default strategy in the given namespace":
        function (test) {
            test.expect(8);

            essencejs.registerByStrategy("test/register/sample/**/*.js", null, {
                namespace : "my_namespace"
            }, function (err) {
                var keys = essencejs.getKeys();

                test.equal(!!err, false);
                test.equal(keys.length > 0, true);
                test.equal(keys.indexOf("my_namespace__now") >= 0, true);
                test.equal(keys.indexOf("my_namespace__MyModel") >= 0, true);

                essencejs.inject(function (now, MyModel) {
                    test.equal(now instanceof Date, false);
                    test.equal(!!MyModel, true);
                    test.equal(MyModel.name, "MyModel");
                }, {
                    namespaces : ["my_namespace"]
                }, function (err) {
                    test.equal(!!err, false);
                    test.done();
                });
            });
        }
};