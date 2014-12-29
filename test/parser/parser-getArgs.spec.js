/*
 * File         :   parser-getArgs.js
 * Description  :   TEST parser getArgs method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    parser = require(path.join(process.cwd(), "src/parser.js"));

module.exports = {
    "Parse function with no arguments":
        function (test) {
            var args;

            args = parser.getArgs(function () { });

            test.ok(parser, args);
            test.equal(args.length, 0, "Incorrect number of arguments for function with no arguments");

            test.expect(2);
            test.done();
        },

    "Parse function with one arguments":
        function (test) {
            var args;

            args = parser.getArgs(function (myArg1) { });

            test.ok(parser, args);
            test.equal(args.length, 1, "Expected one argument to be returned");
            test.equal(args[0], "myArg1");

            test.expect(3);
            test.done();
        },

    "Parse function with two arguments":
        function (test) {
            var args;

            args = parser.getArgs(function (myArg1, myArg2) { });

            test.ok(parser, args);
            test.equal(args.length, 2, "Expected two arguments to be returned");
            test.equal(args[0], "myArg1");
            test.equal(args[1], "myArg2");

            test.expect(4);
            test.done();
        },

    "Arguments passed as an array":
        function (test) {
            var args;

            args = parser.getArgs(["myArg1", "myArg2", function (a1, a2) { }]);

            test.ok(parser, args);
            test.equal(args.length, 2, "Expected two arguments to be returned");
            test.equal(args[0], "myArg1");
            test.equal(args[1], "myArg2");

            test.expect(4);
            test.done();
        },

    "Last argument of an array must be a function":
        function (test) {
            test.throws(function () {
                parser.getArgs(["myArg1"]);
            }, "Last argument in array must be a function", "Check that error is thrown if the last argument of the array declaration is not a function");

            test.expect(1);
            test.done();
        },

    "Too many arguments passed as an array into function":
        function (test) {
            var args;

            args = parser.getArgs(["myArg1", "myArg2", "myArg3", function (a1, a2) { }]);

            test.ok(parser, args);
            test.equal(args.length, 3, "Expect all three arguments to still be specified");
            test.equal(args[0], "myArg1");
            test.equal(args[1], "myArg2");
            test.equal(args[2], "myArg3");

            test.expect(5);
            test.done();
        },

    "Too few arguments passed as an array into function":
        function (test) {
            var args;

            args = parser.getArgs(["myArg1", function (a1, a2) { }]);

            test.ok(parser, args);
            test.equal(args.length, 1, "Expect only one argument to be specified");
            test.equal(args[0], "myArg1");

            test.expect(3);
            test.done();
        },

    "Array with only a function declaration":
        function (test) {
            var args;

            args = parser.getArgs([function () { }]);

            test.ok(parser, args);
            test.equal(args.length, 0, "Expected no arguments to be returned, as specified by the function");

            test.expect(2);
            test.done();
        },

    "Parse function with three arguments and comments in between function parameters":
        function (test) {
            var args;

            args = parser.getArgs(function (myArg1, /* comment out argument myArg2 */ myArg3,myArg4 ) { });

            test.ok(parser, args);
            test.equal(args.length, 3, "Expected three arguments to be returned");
            test.equal(args[0], "myArg1");
            test.equal(args[1], "myArg3");
            test.equal(args[2], "myArg4");

            test.expect(5);
            test.done();
        },

    "Parse function with three arguments and comments in between function parameters spread over multiple lines":
        function (test) {
            var args;

            args = parser.getArgs(function (myArg1, /* comment out
                argument myArg2 */ myArg3, myArg4 ) { });

            test.ok(parser, args);
            test.equal(args.length, 3, "Expected three arguments to be returned");
            test.equal(args[0], "myArg1");
            test.equal(args[1], "myArg3");
            test.equal(args[2], "myArg4");

            test.expect(5);
            test.done();
        },

    "Parse function with three arguments and comments in between function parameters with single line comments":
        function (test) {
            var args;

            args = parser.getArgs(function (myArg1, // comment out argument myArg2
                myArg3, myArg4 ) { });

            test.ok(parser, args);
            test.equal(args.length, 3, "Expected three arguments to be returned");
            test.equal(args[0], "myArg1");
            test.equal(args[1], "myArg3");
            test.equal(args[2], "myArg4");

            test.expect(5);
            test.done();
        }
};
