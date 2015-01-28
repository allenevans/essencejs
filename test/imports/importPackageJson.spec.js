/*
 * File         :   importPackageJson.spec.js
 * Description  :   TEST importing dependencies registers in package.json into the container.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    mockery = require("mockery"),
    essencejs;

module.exports = {
    setUp : function (callback) {
        essencejs = new (require(process.cwd()).EssenceJs)();

        mockery.registerMock('express', {});
        mockery.registerMock('body-parser', {});
        mockery.registerMock('underscore.string', {});

        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        callback();
    },
    tearDown : function(callback) {
        essencejs.dispose();
        mockery.disable();
        callback();
    },

    "Should import from the default package.json file for essencejs":
        function (test) {
            test.expect(4);

            essencejs.importPackageJson();

            test.equal(essencejs.isRegistered("async"), true);
            test.equal(essencejs.isRegistered("clone"), true);
            test.equal(essencejs.isRegistered("glob"), true);
            test.equal(essencejs.isRegistered("jsonfile"), true);

            test.done();
        },
    "Should throw an error if the package.json file path is incorrect":
        function (test) {
            test.expect(1);

            test.throws(function () {
                essencejs.importPackageJson("unknown.xyz");
            });

            test.done();
        },
    "Should register dependencies in specified package.json file":
        function (test) {
            test.expect(3);

            essencejs.importPackageJson("./test/imports/sample-package.json");

            test.equal(essencejs.isRegistered("express"), true);
            test.equal(essencejs.isRegistered("body_parser"), true); // body-parser
            test.equal(essencejs.isRegistered("underscore_string"), true); // underscore.string

            test.done();
        },
    "Should register dependencies in specified package.json file against in the given namespace":
        function (test) {
            test.expect(6);

            essencejs.importPackageJson("./test/imports/sample-package.json", { namespace : "dependencies" } );

            test.equal(essencejs.isRegistered("express", "dependencies"), true);
            test.equal(essencejs.isRegistered("body_parser", "dependencies"), true); // body-parser
            test.equal(essencejs.isRegistered("underscore_string", "dependencies"), true); // underscore.string

            test.equal(essencejs.isRegistered("express", "x"), false);
            test.equal(essencejs.isRegistered("body_parser", "x"), false); // body-parser
            test.equal(essencejs.isRegistered("underscore_string", "x"), false); // underscore.string

            test.done();
        },
    "Should not throw an exception if the package.json does not have any dependencies defined":
        function (test) {
            test.expect(1);

            essencejs.importPackageJson("./test/imports/sample-no-dependencies-package.json");
            test.ok(true);

            test.done();
        }
};