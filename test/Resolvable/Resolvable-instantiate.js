/*
 * File         :   Resolvable-instantiate.js
 * Description  :   TEST instantiating the Resolvable class.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path"),
    Resolvable;

module.exports = {
    setUp : function (callback) {
        Resolvable = require(path.join(process.cwd(), "src/Resolvable.js"));
        callback();
    },
    tearDown : function(callback) {
        Resolvable = null;
        callback();
    },
    "Can instantiate Resolvable":
        function (test) {
            test.expect(6);

            var resolvable = new Resolvable();

            test.equal(resolvable instanceof Resolvable, true);
            test.equal(resolvable.name, null);
            test.equal(resolvable.isPlaceholder, false);
            test.equal(Array.isArray(resolvable.waitFors), true);
            test.equal(resolvable.waitFors.length, 0);
            test.equal(resolvable.item, null);

            test.done()
        },
    "Can instantiate Resolvable with parameters":
        function (test) {
            test.expect(7);

            var resolvable = new Resolvable({
                name : "NAME",
                isPlaceholder : true,
                waitFors : ["SOMETHING"],
                item : function item_function() {}
            });

            test.equal(resolvable instanceof Resolvable, true);
            test.equal(resolvable.name, "NAME");
            test.equal(resolvable.isPlaceholder, true);
            test.equal(Array.isArray(resolvable.waitFors), true);
            test.equal(resolvable.waitFors.length, 1);
            test.equal(resolvable.waitFors[0], "SOMETHING");
            test.equal(resolvable.item.name, "item_function");

            test.done();
        }
};