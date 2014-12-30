/*
 * File         :   importFromFileSystem.spec.js
 * Description  :   TEST import from file system method.
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
    "Should import objects exported modules from the filesystem":
        function (test) {
            test.expect(6);

            essencejs.imports(path.join(__dirname, "sample/**/object*.js"), {
                namespace : "objects"
            }, function (err, result) {
                test.equal(!!err, false);
                test.equal(Array.isArray(result), true);
                test.equal(result.length, 2);
                test.equal(result[0].name, "object1");
                test.equal(result[1].name, "object2");
                test.equal(essencejs.isRegistered("object1", "objects"), true);

                test.done();
            });
        },
    "Should import exported function modules from the filesystem":
        function (test) {
            test.expect(6);

            essencejs.imports(path.join(__dirname, "sample/**/function*.js"), {
                namespace : "functions"
            }, function (err, result) {
                test.equal(!!err, false);
                test.equal(Array.isArray(result), true);
                test.equal(result.length, 2);
                test.equal(result[0], "function1");
                test.equal(typeof result[1] === "function", true);
                test.equal(essencejs.isRegistered("function1", "functions"), true);

                test.done();
            });
        },
    "Should import class with dependencies":
        function (test) {
            test.expect(5);

            essencejs.imports(path.join(__dirname, "sample/**/*.js"), {
                namespace : "functions"
            }, function (err, result) {
                test.equal(!!err, false);
                test.equal(Array.isArray(result), true);
                test.equal(result.length, 5);
                test.equal(essencejs.isRegistered("MyClass"), true);

                essencejs.inject(function (MyClass) {
                    test.equal((new MyClass).getValue(), 123 + 456);
                    test.done();
                });
            });
        },
    "Should import class with dependencies using a directory path relative to the current working directory":
        function (test) {
            test.expect(5);

            essencejs.imports("./sample/**/*.js", {
                namespace : "functions",
                cwd : __dirname
            }, function (err, result) {
                test.equal(!!err, false);
                test.equal(Array.isArray(result), true);
                test.equal(result.length, 5);
                test.equal(essencejs.isRegistered("MyClass"), true);

                essencejs.inject(function (MyClass) {
                    test.equal((new MyClass).getValue(), 123 + 456);
                    test.done();
                });
            });
        },
    "Should import class with dependencies using a directory path relative to the parent working directory":
        function (test) {
            test.expect(5);

            essencejs.imports("../imports/sample/**/*.js", {
                namespace : "functions",
                cwd : __dirname
            }, function (err, result) {
                test.equal(!!err, false);
                test.equal(Array.isArray(result), true);
                test.equal(result.length, 5);
                test.equal(essencejs.isRegistered("MyClass"), true);

                essencejs.inject(function (MyClass) {
                    test.equal((new MyClass).getValue(), 123 + 456);
                    test.done();
                });
            });
        }
};