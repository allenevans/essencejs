/*
 * File         :   util-splitNamespaceKey.js
 * Description  :   TEST util namespaceKey method.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    util = require(path.join(process.cwd(), "src/util.js"));

module.exports = {
    "Should get the namespace from a valid namespace key variable name":
        function (test) {
            test.expect(2);

            var input = "my_namespace__myKey";

            var result = util.splitNamespaceKey(input);

            test.equal(result.namespace, "my_namespace");
            test.equal(result.key, "myKey");

            test.done();
        },
    "Should still get the key if no namespace is defined":
        function (test) {
            test.expect(2);

            var input = "myKey";

            var result = util.splitNamespaceKey(input);

            test.equal(result.namespace, "");
            test.equal(result.key, "myKey");

            test.done();
        },
    "Should still get the key if key is prefixed with __ but no namespace":
        function (test) {
            test.expect(2);

            var input = "__myKey";

            var result = util.splitNamespaceKey(input);

            test.equal(result.namespace, "");
            test.equal(result.key, "__myKey");

            test.done();
        },
    "Should handle __ in the key name":
        function (test) {
            test.expect(2);

            var input = "my_namespace__my__Key";

            var result = util.splitNamespaceKey(input);

            test.equal(result.namespace, "my_namespace");
            test.equal(result.key, "my__Key");

            test.done();
        },
    "Should give an object that can reconstruct the key using the toString method":
        function (test) {
            test.expect(3);

            var input1 = "my_namespace__my__Key",
                input2 = "__myKey",
                input3 = "myNamespace__myKey";

            var result1 = util.splitNamespaceKey(input1).toString(),
                result2 = util.splitNamespaceKey(input2).toString(),
                result3 = util.splitNamespaceKey(input3).toString();

            test.equal(result1, "my_namespace__my__Key");
            test.equal(result2, "__myKey");
            test.equal(result3, "myNamespace__myKey");

            test.done();
        }
};