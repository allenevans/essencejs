/*
 * File         :   Resolvable-dispose.spec.js
 * Description  :   TEST dispose of an instantiated Resolvable class.
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
    "Can dispose instantiated Resolvable instance":
        function (test) {
            test.expect(4);

            var resolvable = new Resolvable({
                name : "NAME",
                isPlaceholder : true,
                waitFors : ["SOMETHING"],
                item : function item_function() {}
            });

            resolvable.dispose();

            test.equal(resolvable.name, undefined);
            test.equal(resolvable.isPlaceholder, undefined);
            test.equal(resolvable.waitFors, undefined);
            test.equal(resolvable.item, undefined);

            test.done();
        }
};